import { Module } from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { AttendanceController } from './attendance.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import {Attendance} from "./entities/attendance.entity";
import {Student} from "../students/entities/student.entity";
import {ClassSchedule} from "../class-schedule/entities/class-schedule.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Attendance,Student,ClassSchedule])],
  controllers: [AttendanceController],
  providers: [AttendanceService],
})
export class AttendanceModule {}
