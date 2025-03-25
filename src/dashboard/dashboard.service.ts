import {Injectable} from '@nestjs/common';
import {CreateDashboardDto} from './dto/create-dashboard.dto';
import {UpdateDashboardDto} from './dto/update-dashboard.dto';
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {Student} from "../students/entities/student.entity";
import {User} from "../users/entities/user.entity";
import {Course} from "../courses/entities/course.entity";
import {Enrollment} from "../enrollment/entities/enrollment.entity";
import {Attendance} from "../attendance/entities/attendance.entity";
import {Batch} from "../batches/entities/batch.entity";
import {ClassSchedule} from "../class-schedule/entities/class-schedule.entity";
import {Subject} from "../subjects/entities/subject.entity";
import {Teacher} from "../teachers/entities/teacher.entity";

@Injectable()
export class DashboardService {
    constructor(
        @InjectRepository(User) private userRepository: Repository<User>,
        @InjectRepository(Student) private studentRepository: Repository<Student>,
        @InjectRepository(Course) private courseRepository: Repository<Course>,
        @InjectRepository(Enrollment) private enrollmentRepository: Repository<Enrollment>,
        @InjectRepository(Attendance) private attendanceRepository: Repository<Attendance>,
        @InjectRepository(Batch) private batchRepository: Repository<Batch>,
        @InjectRepository(ClassSchedule) private classScheduleRepository: Repository<ClassSchedule>,
        @InjectRepository(Subject) private subjectRepository: Repository<Subject>,
        @InjectRepository(Teacher) private teacherRepository: Repository<Teacher>,
    ) {
    }

    async getTableCounts(createDashboardDto: CreateDashboardDto): Promise<any> {
        // Apply filters for each table
        const courseCount = await this.courseRepository.count();
        const subjectCount = await this.subjectRepository.count();
        const studentCount = await this.studentRepository.count({where: {status: 'ACTIVE'}});
        const teacherCount = await this.teacherRepository.count();

      const classScheduleCountQuery = await this.classScheduleRepository
          .createQueryBuilder('class_schedule')
          .select('DISTINCT class_schedule.batchId', 'batch_id') // Ensuring uniqueness of the batch
          .addSelect('class_schedule.subjectId', 'subject_id')
          .addSelect('COUNT(class_schedule.id)', 'count')
          .where('class_schedule.class_date > :currentDate', {currentDate: new Date()}) // Only future classes
          .groupBy('class_schedule.batchId')
          .addGroupBy('class_schedule.subjectId')
          .getRawMany();

      const classScheduleCount = classScheduleCountQuery.length;
        const attendanceCount = await this.attendanceRepository.count();

        return {
            studentCount,
            courseCount,
            attendanceCount,
            classScheduleCount,
            subjectCount,
            teacherCount,
        };

    }
}
