import {Injectable, NotFoundException} from '@nestjs/common';
import { CreateBatchDto } from './dto/create-batch.dto';
import { UpdateBatchDto } from './dto/update-batch.dto';
import {Batch} from "./entities/batch.entity";
import {Repository} from "typeorm";
import {Course} from "../courses/entities/course.entity";
import {InjectRepository} from "@nestjs/typeorm";

@Injectable()
export class BatchesService {
  constructor(
      @InjectRepository(Batch)
      private batchRepository: Repository<Batch>,
      @InjectRepository(Course)
      private courseRepository: Repository<Course>,
  ) {}

  // Create a new batch
  async create(createBatchDto: CreateBatchDto): Promise<Batch> {
    const course = await this.courseRepository.findOne({where:{id:createBatchDto.courseId}});
    if (!course) {
      throw new NotFoundException('Course not found');
    }

    const batch = this.batchRepository.create({
      name: createBatchDto.name,
      start_date: createBatchDto.start_date,
      end_date: createBatchDto.end_date,
      course,
    });

    return this.batchRepository.save(batch);
  }

  // Get all batches
  async findAll(): Promise<Batch[]> {
    return this.batchRepository.find({ relations: ['course'] });
  }

  // Get a batch by ID
  async findOne(id: number): Promise<Batch> {
    const batch = await this.batchRepository.findOne({
      where: { id },
      relations: ['course'],
    });

    if (!batch) {
      throw new NotFoundException(`Batch with ID ${id} not found`);
    }
    return batch;
  }

  // Update a batch
  async update(id: number, updateBatchDto: UpdateBatchDto): Promise<Batch> {
    const batch = await this.findOne(id);

    if (updateBatchDto.courseId) {
      const course = await this.courseRepository.findOne({where:{id:updateBatchDto.courseId}});
      if (!course) {
        throw new NotFoundException('Course not found');
      }
      batch.course = course;
    }

    if (updateBatchDto.name) {
      batch.name = updateBatchDto.name;
    }
    if (updateBatchDto.start_date) {
      batch.start_date = updateBatchDto.start_date;
    }
    if (updateBatchDto.end_date) {
      batch.end_date = updateBatchDto.end_date;
    }

    return this.batchRepository.save(batch);
  }

  // Delete a batch
  async remove(id: number): Promise<string> {
    const batch = await this.findOne(id);
    await this.batchRepository.remove(batch);
    return "deleted";
  }
}
