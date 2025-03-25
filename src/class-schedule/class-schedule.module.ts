import { Module } from '@nestjs/common';
import { ClassScheduleService } from './class-schedule.service';
import { ClassScheduleController } from './class-schedule.controller';
import {ClassSchedule} from "./entities/class-schedule.entity";
import {Batch} from "../batches/entities/batch.entity";
import {Subject} from "../subjects/entities/subject.entity";
import {TypeOrmModule} from "@nestjs/typeorm";

@Module({
  imports: [TypeOrmModule.forFeature([ClassSchedule, Batch, Subject])],
  providers: [ClassScheduleService],
  controllers: [ClassScheduleController],
})
export class ClassScheduleModule {}
