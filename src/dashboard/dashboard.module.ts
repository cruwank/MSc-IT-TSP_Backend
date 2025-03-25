import { Module } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { DashboardController } from './dashboard.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import {Enrollment} from "../enrollment/entities/enrollment.entity";
import {Batch} from "../batches/entities/batch.entity";
import {User} from "../users/entities/user.entity";
import {ClassSchedule} from "../class-schedule/entities/class-schedule.entity";
import {Teacher} from "../teachers/entities/teacher.entity";
import {Attendance} from "../attendance/entities/attendance.entity";
import {Subject} from "../subjects/entities/subject.entity";
import {Student} from "../students/entities/student.entity";
import {Course} from "../courses/entities/course.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Student, Course, Enrollment, Attendance, Batch, ClassSchedule, Subject, Teacher]),
  ],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
