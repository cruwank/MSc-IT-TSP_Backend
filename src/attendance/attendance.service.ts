import {Injectable, NotFoundException} from '@nestjs/common';
import { CreateAttendanceDto } from './dto/create-attendance.dto';
import {Repository} from "typeorm";
import {Attendance} from "./entities/attendance.entity";
import {InjectRepository} from "@nestjs/typeorm";
import {Student} from "../students/entities/student.entity";
import {ClassSchedule} from "../class-schedule/entities/class-schedule.entity";
import { isAfter, isBefore } from 'date-fns';
import {validateParams} from "../common/helpers/validator.helper";
import {paginate} from "../common/helpers/common.helper";
import {AttendanceDto} from "./dto/attendance.dto"; // Import date-fns for comparison

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
    return this.attendanceRepository.save(attendance);
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
    const {courseId,subjectId,value, page, limit} = attendanceDto;
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
          'subject.name LIKE :name OR course.course_name LIKE :name OR students.first_name LIKE :name OR students.last_name LIKE :name',
          { name: `%${value}%` }
      );
    }
    if (courseId) {
      query.andWhere('course.id = :courseId', {courseId});
    }
    if (subjectId) {
      query.andWhere('subject.id = :subjectId', {subjectId});
    }

    // query.distinct(true);
    query.orderBy('attendance.created_datetime', 'DESC')

    // Pagination
    return paginate(query, page, limit);
  }
}
