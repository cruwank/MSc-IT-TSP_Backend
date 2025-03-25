import { Module } from '@nestjs/common';
import { EnrollmentService } from './enrollment.service';
import { EnrollmentController } from './enrollment.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import {Enrollment} from "./entities/enrollment.entity";
import {Student} from "../students/entities/student.entity";
import {Batch} from "../batches/entities/batch.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Enrollment,Student,Batch])],
  controllers: [EnrollmentController],
  providers: [EnrollmentService],
})
export class EnrollmentModule {}
