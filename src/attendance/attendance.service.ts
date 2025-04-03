import {Injectable, NotFoundException} from '@nestjs/common';
import {CreateAttendanceDto} from './dto/create-attendance.dto';
import {Repository} from "typeorm";
import {Attendance} from "./entities/attendance.entity";
import {InjectRepository} from "@nestjs/typeorm";
import {Student} from "../students/entities/student.entity";
import {ClassSchedule} from "../class-schedule/entities/class-schedule.entity";
import {isAfter, isBefore} from 'date-fns';
import {validateParams} from "../common/helpers/validator.helper";
import {paginate} from "../common/helpers/common.helper";
import {AttendanceDto} from "./dto/attendance.dto";
import {da} from "date-fns/locale";
import Stream, {Readable} from "stream"; // Import date-fns for comparison
import { format } from 'fast-csv';
@Injectable()
export class AttendanceService {
  constructor(
      @InjectRepository(Attendance)
      private readonly attendanceRepository: Repository<Attendance>,
      @InjectRepository(Student)
      private readonly studentRepository: Repository<Student>,
      @InjectRepository(ClassSchedule)
      private readonly classScheduleRepository: Repository<ClassSchedule>
  ) {}

  // CREATE: Create a new attendance record
  async create(createAttendanceDto: CreateAttendanceDto): Promise<Attendance> {
    // Check if the student exists
    const student = await this.studentRepository.findOne({where: {id: createAttendanceDto.studentId}});
    if (!student) {
      throw new NotFoundException(`Student with ID ${createAttendanceDto.studentId} not found`);
    }

    // Check if the class schedule exists
    let classSchedule;
    if (createAttendanceDto.qrCode) {
      classSchedule = await this.classScheduleRepository.findOne({where: {qr_code: createAttendanceDto.qrCode}})
    } else {
      classSchedule = await this.classScheduleRepository.findOne({where: {id: createAttendanceDto.scheduleId}})
    }

    if (!classSchedule) {
      throw new NotFoundException(`Class schedule with ID ${createAttendanceDto.scheduleId} not found`);
    }

    const currentTime = new Date();
    const classStartTime = new Date(`${classSchedule.class_date}T${classSchedule.start_time}:00`);

    let status: 'present' | 'late' | 'absent' = 'present'; // Default status is present

    // If the current time is after the class start time, set status as late
    if (isAfter(currentTime, classStartTime)) {
      status = 'late';
    }

    // If the current time is before the class start time, set status as present
    if (isBefore(currentTime, classStartTime)) {
      status = 'present';
    }

    // Create the attendance record
    const attendance = this.attendanceRepository.create({
      student,
      schedule: classSchedule,
      status: status,
      remarks: createAttendanceDto.remarks,
    });

    // Save and return the created attendance
    const att = await this.attendanceRepository.save(attendance)

    const query = this.attendanceRepository
        .createQueryBuilder('attendance')
        .leftJoinAndSelect('attendance.student', 'student') // Assuming there is a batch relation
        .leftJoinAndSelect('attendance.schedule', 'schedule')
        .leftJoinAndSelect('schedule.subject', 'subject')
        .leftJoinAndSelect('subject.teacher', 'teacher')
        .leftJoinAndSelect('schedule.batch', 'batch')
        .leftJoinAndSelect('batch.course', 'course')

    if (att.id) {
      query.andWhere('attendance.id = :attendanceId', {attendanceId:att.id});
    }
    const [data] = await query.getManyAndCount();
    return data[0];
  }

  // READ: Get all attendance records
  async findAll(): Promise<Attendance[]> {
    return this.attendanceRepository.find({
      relations: ['student', 'schedule'], // Eagerly load related entities
    });
  }

  // READ: Get a specific attendance record by ID
  async findOne(id: number): Promise<Attendance> {
    const attendance = await this.attendanceRepository.findOne({where: {id},
      relations: ['student', 'schedule'], // Eagerly load related entities
    });

    if (!attendance) {
      throw new NotFoundException(`Attendance with ID ${id} not found`);
    }

    return attendance;
  }

  // DELETE: Delete an attendance record
  async remove(id: number): Promise<void> {
    // Check if the attendance record exists
    const attendance = await this.attendanceRepository.findOne({where: {id}});

    if (!attendance) {
      throw new NotFoundException(`Attendance with ID ${id} not found`);
    }

    // Remove the attendance record
    await this.attendanceRepository.remove(attendance);
  }

  async filter(attendanceDto: AttendanceDto) {
    console.log(attendanceDto)
    const {attendanceId,studentId,courseId,subjectId,value,date, page, limit} = attendanceDto;
    validateParams(attendanceDto,['page','limit'])


    const query = this.attendanceRepository
        .createQueryBuilder('attendance')
        .leftJoinAndSelect('attendance.student', 'student') // Assuming there is a batch relation
        .leftJoinAndSelect('attendance.schedule', 'schedule')
        .leftJoinAndSelect('schedule.subject', 'subject')
        .leftJoinAndSelect('subject.teacher', 'teacher')
        .leftJoinAndSelect('schedule.batch', 'batch')
        .leftJoinAndSelect('batch.course', 'course') // Assuming there is a course relation in Subject


    // Filter by status
    if (value) {
      query.andWhere(
          'subject.subject_name LIKE :name OR course.course_name LIKE :name OR student.first_name LIKE :name OR student.last_name LIKE :name',
          { name: `%${value}%` }
      );
    }
    if (date) {
      query.andWhere(
          'attendance.created_datetime LIKE :date',
          { date: `%${date}%` } // Corrected parameter name
      );
    }
    if (attendanceId) {
      query.andWhere('attendance.id = :attendanceId', {attendanceId});
    }
    if (courseId) {
      query.andWhere('course.id = :courseId', {courseId});
    }
    if (studentId) {
      query.andWhere('student.id = :studentId', {studentId});
    }
    if (subjectId) {
      query.andWhere('subject.id = :subjectId', {subjectId});
    }

    // query.distinct(true);
    query.orderBy('attendance.created_datetime', 'DESC')

    // Pagination
    return paginate(query, page, limit);
  }
  async filterDownload(attendanceDto: AttendanceDto) {
    console.log(attendanceDto)
    const {attendanceId,studentId,courseId,subjectId,value,date, page, limit} = attendanceDto;

    const query = this.attendanceRepository
        .createQueryBuilder('attendance')
        .leftJoinAndSelect('attendance.student', 'student') // Assuming there is a batch relation
        .leftJoinAndSelect('attendance.schedule', 'schedule')
        .leftJoinAndSelect('schedule.subject', 'subject')
        .leftJoinAndSelect('subject.teacher', 'teacher')
        .leftJoinAndSelect('schedule.batch', 'batch')
        .leftJoinAndSelect('batch.course', 'course') // Assuming there is a course relation in Subject
        .select([
          'attendance.created_datetime',
          'student.first_name',
          'student.last_name',
          'course.course_name',
          'subject.subject_name',
          'teacher.first_name',
          'teacher.last_name',
        ]);

    // Filter by status
    if (value) {
      query.andWhere(
          'subject.subject_name LIKE :name OR course.course_name LIKE :name OR student.first_name LIKE :name OR student.last_name LIKE :name',
          { name: `%${value}%` }
      );
    }
    if (date) {
      query.andWhere(
          'attendance.created_datetime LIKE :date',
          { date: `%${date}%` } // Corrected parameter name
      );
    }
    if (attendanceId) {
      query.andWhere('attendance.id = :attendanceId', {attendanceId});
    }
    if (courseId) {
      query.andWhere('course.id = :courseId', {courseId});
    }
    if (studentId) {
      query.andWhere('student.id = :studentId', {studentId});
    }
    if (subjectId) {
      query.andWhere('subject.id = :subjectId', {subjectId});
    }

    // query.distinct(true);
    query.orderBy('attendance.created_datetime', 'DESC')

    // Pagination


    const data = await query.getRawMany();

    // Create a new workbook and worksheet
    return new Promise((resolve, reject) => {
      const csvStream = format({ headers: true });
      const chunks: Buffer[] = [];

      // Create a readable stream
      const stream = new Readable({
        read() {},
      });

      // Pipe stream to buffer
      csvStream.on('data', (chunk) => chunks.push(chunk));
      csvStream.on('end', () => resolve(Buffer.concat(chunks)));
      csvStream.on('error', reject);

      data.forEach((row) => {
        csvStream.write({
          'Attendance Date': row.attendance_created_datetime.toISOString().split('T')[0],
          'Student Name': `${row.student_first_name} ${row.student_last_name}`,
          'Course': row.course_course_name,
          'Module': row.subject_subject_name,
          'Instructor': `${row.teacher_first_name} ${row.teacher_last_name}`,
        });
      });

      csvStream.end();
    });
  }
}
