import {Injectable, NotFoundException} from '@nestjs/common';
import { CreateClassScheduleDto } from './dto/create-class-schedule.dto';
import { UpdateClassScheduleDto } from './dto/update-class-schedule.dto';
import {InjectRepository} from "@nestjs/typeorm";
import {ClassSchedule} from "./entities/class-schedule.entity";
import {Batch} from "../batches/entities/batch.entity";
import {Repository} from "typeorm";
import {Subject} from "../subjects/entities/subject.entity";
import {ClassScheduleDto} from "./dto/class-schedule.dto";
import {validateParams} from "../common/helpers/validator.helper";
import {paginate} from "../common/helpers/common.helper";
import * as QRCode from 'qrcode';

@Injectable()
export class ClassScheduleService {
  constructor(
      @InjectRepository(ClassSchedule)
      private classScheduleRepository: Repository<ClassSchedule>,
      @InjectRepository(Batch)
      private batchRepository: Repository<Batch>,
      @InjectRepository(Subject)
      private subjectRepository: Repository<Subject>,
  ) {}

  // Create a new class schedule
  async create(createClassScheduleDto: CreateClassScheduleDto): Promise<ClassSchedule> {
    const batch = await this.batchRepository.findOne({where: {id:createClassScheduleDto.batchId}});
    const subject = await this.subjectRepository.findOne({where:{id:createClassScheduleDto.subjectId}});

    if (!batch) {
      throw new NotFoundException('Batch not found');
    }
    if (!subject) {
      throw new NotFoundException('Subject not found');
    }

    const classSchedule = this.classScheduleRepository.create({
      batch,
      subject,
      class_date: createClassScheduleDto.class_date,
      start_time: createClassScheduleDto.start_time,
      end_time: createClassScheduleDto.end_time,
      qr_code: this.generateQRCode(),
    });

    return this.classScheduleRepository.save(classSchedule);
  }

  // Get all class schedules
  async findAll(): Promise<ClassSchedule[]> {
    return this.classScheduleRepository.find({ relations: ['batch', 'subject'] });
  }

  // Get a class schedule by ID
  async findOne(id: number): Promise<ClassSchedule> {
    const classSchedule = await this.classScheduleRepository.findOne({
      where: { id },
      relations: ['batch', 'subject'],
    });

    if (!classSchedule) {
      throw new NotFoundException(`Class schedule with ID ${id} not found`);
    }

    return classSchedule;
  }

  // Update a class schedule
  async update(id: number, updateClassScheduleDto: UpdateClassScheduleDto): Promise<ClassSchedule> {
    const classSchedule = await this.findOne(id);

    if (updateClassScheduleDto.batchId) {
      const batch = await this.batchRepository.findOne({where: {id:updateClassScheduleDto.batchId}});
      if (!batch) {
        throw new NotFoundException('Batch not found');
      }
      classSchedule.batch = batch;
    }

    if (updateClassScheduleDto.subjectId) {
      const subject = await this.subjectRepository.findOne({where:{id:updateClassScheduleDto.subjectId}});
      if (!subject) {
        throw new NotFoundException('Subject not found');
      }
      classSchedule.subject = subject;
    }

    if (updateClassScheduleDto.class_date) {
      classSchedule.class_date = updateClassScheduleDto.class_date;
    }

    if (updateClassScheduleDto.start_time) {
      classSchedule.start_time = updateClassScheduleDto.start_time;
    }

    if (updateClassScheduleDto.end_time) {
      classSchedule.end_time = updateClassScheduleDto.end_time;
    }

    return this.classScheduleRepository.save(classSchedule);
  }

  // Delete a class schedule
  async remove(id: number): Promise<string> {
    const classSchedule = await this.findOne(id);
    await this.classScheduleRepository.remove(classSchedule);
    return "deleted";
  }

  async filter(classScheduleDto: ClassScheduleDto) {
    const {courseId,subjectId,value, page, limit} = classScheduleDto;
    validateParams(classScheduleDto,['page','limit'])


    const query = this.classScheduleRepository
        .createQueryBuilder('class_schedules')
        .leftJoinAndSelect('class_schedules.batch', 'batch') // Assuming there is a batch relation
        .leftJoinAndSelect('class_schedules.subject', 'subject')
        .leftJoinAndSelect('subject.teacher', 'teacher')
        .leftJoinAndSelect('batch.course', 'course') // Assuming there is a course relation in Subject
        // .select([
        //   'course.course_name AS courseName',
        //   'subject.subject_name AS subjectName',
        //   'class_schedules.class_date AS classDate',
        //   'CONCAT(teacher.first_name, " ", teacher.last_name) AS teacherName', // Concatenate first and last name as teacherName
        // ])

    // Filter by status
    if (value) {
      query.andWhere(
          'subject.subject_name LIKE :name OR course.course_name LIKE :name OR teacher.first_name LIKE :name OR teacher.last_name LIKE :name',
          { name: `%${value}%` }
      );
    }
    if (courseId) {
      query.andWhere('subject.id = :courseId', {courseId});
    }
    if (subjectId) {
      query.andWhere('subject.id = :subjectId', {subjectId});
    }

    // query.distinct(true);
    query.orderBy('class_schedules.class_date', 'ASC')

    // Pagination
    return paginate(query, page, limit);
  }

  async viewQr(id: number, width: number, margin: number) {
    let classSchedulePromise = await this.findOne(id);
    return await QRCode.toBuffer(classSchedulePromise.qr_code, {
      width: width,
      margin, // Adjust margin if needed
    });
  }

  generateQRCode() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'; // Uppercase letters and numbers
    let randomString = '';

    // Generate a random string of 6 characters
    for (let i = 0; i < 6; i++) {
      const randomIndex = Math.floor(Math.random() * chars.length);
      randomString += chars[randomIndex];
    }

    const timestamp = Date.now().toString(36).toUpperCase(); // Convert timestamp to base-36 and uppercase it
    // Combine timestamp and random string
    return `${timestamp}-${randomString}`;
  }
}
