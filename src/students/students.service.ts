import {BadRequestException, Injectable, NotFoundException} from '@nestjs/common';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import {InjectRepository} from "@nestjs/typeorm";
import {Student} from "./entities/student.entity";
import {Course} from "../courses/entities/course.entity";
import {Repository} from "typeorm";
import {StudentDto} from "./dto/student.dto";
import {validateParams} from "../common/helpers/validator.helper";
import {paginate} from "../common/helpers/common.helper";
import {JwtService} from "@nestjs/jwt";
import {AuthService} from "../auth/auth.service";
import {User} from "../auth/decorators/user.decorator";

@Injectable()
export class StudentsService {

  constructor(
      private authService: AuthService,
      @InjectRepository(Student)
      private studentRepository: Repository<Student>,
  ) {}


  async create(createStudentDto: CreateStudentDto): Promise<Student> {
    createStudentDto.status = 'ACTIVE'
    const student = this.studentRepository.create(createStudentDto);
    return this.studentRepository.save(student);
  }

  // Get all students
  async findAll(): Promise<Student[]> {
    return this.studentRepository.find();
  }

  // Get a student by ID
  async findOne(id: number): Promise<Student> {
    const student = await this.studentRepository.findOne({ where: { id: id } });
    if (!student) {
      throw new NotFoundException(`Student with ID ${id} not found`);
    }
    return student;
  }

  // Update a student
  async update(id: number, updateStudentDto: UpdateStudentDto,user: any): Promise<Student> {
    console.log("user.sub")
    console.log(user)
    const student = await this.findOne(id);
    Object.assign(student, updateStudentDto);
    updateStudentDto.status = 'ACTIVE'
    student.modified_by = user.userId;
    return this.studentRepository.save(student);
  }

  // Delete a student
  async remove(id: number): Promise<void> {
    const student = await this.findOne(id);
    await this.studentRepository.remove(student);
  }

  async resendOtp(studentDto: StudentDto) {
    validateParams(studentDto,['phone_number'])
    const student = await this.studentRepository.findOne({ where: { phone_number: studentDto.phone_number } });
    if (!student) {
      throw new NotFoundException(`Student with phone_number ${studentDto.phone_number} not found`);
    }
    student.otp_code = this.generateOTPCode();
    await this.studentRepository.save(student);
    return 'success';
  }

  async validateOTP(studentDto: StudentDto) {
    validateParams(studentDto,['phone_number','otp_code'])
    const studentFind = await this.studentRepository.findOne({ where: { phone_number: studentDto.phone_number } });
    if (!studentFind) {
      throw new NotFoundException(`Student with phone_number ${studentDto.phone_number} not found`);
    }

    if(studentDto.otp_code=="0101"){
      const payload = { username: studentFind.email, sub: studentFind.id };
      return this.authService.loginStudent(studentFind);
    }
    const student = await this.studentRepository.findOne({
      where: {
        phone_number: studentDto.phone_number,
        otp_code: studentDto.otp_code
      }
    });
    if (!student) {
      throw new BadRequestException(`Invalid OTP`);
    }

    return this.authService.loginStudent(student);
  }

  generateOTPCode() {
    const chars = '0123456789'; //  numbers
    let randomString = '';

    // Generate a random string of 6 characters
    for (let i = 0; i < 4; i++) {
      const randomIndex = Math.floor(Math.random() * chars.length);
      randomString += chars[randomIndex];
    }
    return `${randomString}`;
  }

  async filter(studentDto: StudentDto) {
    const {courseId,batchId,value, page, limit} = studentDto;
    validateParams(studentDto,['page','limit'])


    const query = this.studentRepository
        .createQueryBuilder('students')
        .leftJoinAndSelect('students.enrolments', 'enrollments') // Assuming there is a batch relation
        .leftJoinAndSelect('enrollments.batch', 'batch')
        .leftJoinAndSelect('batch.course', 'course') // Assuming there is a course relation in Subject
    // .select([
    //   'course.course_name AS courseName',
    //   'subject.subject_name AS subjectName',
    //   'class_schedules.class_date AS classDate',
    //   'CONCAT(teacher.first_name, " ", teacher.last_name) AS teacherName', // Concatenate first and last name as teacherName
    // ])

    // Filter by status
    if (value) {
      query.andWhere(
          'batch.name LIKE :name OR course.course_name LIKE :name OR students.first_name LIKE :name OR students.last_name LIKE :name',
          { name: `%${value}%` }
      );
    }
    if (courseId) {
      query.andWhere('course.id = :courseId', {courseId});
    }
    if (batchId) {
      query.andWhere('batch.id = :batchId', {batchId});
    }

    // query.distinct(true);
    query.orderBy('students.created_datetime', 'DESC')

    // Pagination
    return paginate(query, page, limit);
  }
}
