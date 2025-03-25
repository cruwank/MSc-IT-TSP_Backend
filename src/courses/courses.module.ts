import { Module } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { CoursesController } from './courses.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import {Course} from "./entities/course.entity";
import {CourseSubject} from "./entities/course-subject.entity";
import {Subject} from "../subjects/entities/subject.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Course,CourseSubject,Subject])],
  providers: [CoursesService],
  controllers: [CoursesController],
})
export class CoursesModule {}
