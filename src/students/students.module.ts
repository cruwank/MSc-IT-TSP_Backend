import { Module } from '@nestjs/common';
import { StudentsService } from './students.service';
import { StudentsController } from './students.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import {Attendance} from "../attendance/entities/attendance.entity";
import {Student} from "./entities/student.entity";
import {JwtModule} from "@nestjs/jwt";
import {AuthModule} from "../auth/auth.module";

@Module({
  imports: [
  TypeOrmModule.forFeature([Student]),AuthModule],
  controllers: [StudentsController],
  providers: [StudentsService],
})
export class StudentsModule {}
