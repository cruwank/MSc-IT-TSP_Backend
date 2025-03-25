import { Module } from '@nestjs/common';
import { BatchesService } from './batches.service';
import { BatchesController } from './batches.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import {Batch} from "./entities/batch.entity";
import {Course} from "../courses/entities/course.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Batch,Course])],
  controllers: [BatchesController],
  providers: [BatchesService],
})
export class BatchesModule {}
