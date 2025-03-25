import {Injectable, NotFoundException} from '@nestjs/common';
import { CreateTeacherDto } from './dto/create-teacher.dto';
import { UpdateTeacherDto } from './dto/update-teacher.dto';
import {Repository} from "typeorm";
import {Teacher} from "./entities/teacher.entity";
import {InjectRepository} from "@nestjs/typeorm";

@Injectable()
export class TeachersService {
  constructor(
      @InjectRepository(Teacher)
      private teacherRepository: Repository<Teacher>,
  ) {}

  // Create a new teacher
  async create(createTeacherDto: CreateTeacherDto): Promise<Teacher> {
    const teacher = this.teacherRepository.create(createTeacherDto);
    return this.teacherRepository.save(teacher);
  }

  // Get all teachers
  async findAll(): Promise<Teacher[]> {
    return this.teacherRepository.find();
  }

  // Get a teacher by ID
  async findOne(id: number): Promise<Teacher> {
    const teacher = await this.teacherRepository.findOne({ where: { id } });
    if (!teacher) {
      throw new NotFoundException(`Teacher with ID ${id} not found`);
    }
    return teacher;
  }

  // Update a teacher
  async update(id: number, updateTeacherDto: UpdateTeacherDto): Promise<Teacher> {
    const teacher = await this.findOne(id);
    Object.assign(teacher, updateTeacherDto);
    return this.teacherRepository.save(teacher);
  }

  // Delete a teacher
  async remove(id: number): Promise<string> {
    const teacher = await this.findOne(id);
    await this.teacherRepository.remove(teacher);
    return "deleted";
  }
}
