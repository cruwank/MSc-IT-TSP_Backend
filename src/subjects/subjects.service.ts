import {Injectable, NotFoundException} from '@nestjs/common';
import { CreateSubjectDto } from './dto/create-subject.dto';
import { UpdateSubjectDto } from './dto/update-subject.dto';
import {Repository} from "typeorm";
import {InjectRepository} from "@nestjs/typeorm";
import {Subject} from "./entities/subject.entity";
import {Teacher} from "../teachers/entities/teacher.entity";

@Injectable()
export class SubjectsService {
  constructor(
      @InjectRepository(Subject)
      private subjectRepository: Repository<Subject>,
      @InjectRepository(Teacher)
      private teacherRepository: Repository<Teacher>,
  ) {}

  // Create a new subject
  async create(createSubjectDto: CreateSubjectDto): Promise<Subject> {
    const teacher = await this.teacherRepository.findOne({where:{id:createSubjectDto.teacherId}});
    if (!teacher) {
      throw new NotFoundException('Teacher not found');
    }

    const subject = this.subjectRepository.create({
      subject_name: createSubjectDto.subject_name,
      description: createSubjectDto.description,
      teacher,
    });

    return this.subjectRepository.save(subject);
  }

  // Get all subjects
  async findAll(): Promise<Subject[]> {
    return this.subjectRepository.find({ relations: ['teacher'] });
  }

  // Get a subject by ID
  async findOne(id: number): Promise<Subject> {
    const subject = await this.subjectRepository.findOne({
      where: { id },
      relations: ['teacher'],
    });

    if (!subject) {
      throw new NotFoundException(`Subject with ID ${id} not found`);
    }
    return subject;
  }

  // Update a subject
  async update(id: number, updateSubjectDto: UpdateSubjectDto): Promise<Subject> {
    const subject = await this.findOne(id);

    if (updateSubjectDto.teacherId) {
      const teacher = await this.teacherRepository.findOne({where:{id:updateSubjectDto.teacherId}});
      if (!teacher) {
        throw new NotFoundException('Teacher not found');
      }
      subject.teacher = teacher;
    }

    if (updateSubjectDto.subject_name) {
      subject.subject_name = updateSubjectDto.subject_name;
    }
    if (updateSubjectDto.description) {
      subject.description = updateSubjectDto.description;
    }

    return this.subjectRepository.save(subject);
  }

  // Delete a subject
  async remove(id: number): Promise<string> {
    const subject = await this.findOne(id);
    await this.subjectRepository.remove(subject);
    return  "deleted";
  }
}
