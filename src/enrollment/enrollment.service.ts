import {Injectable, NotFoundException} from '@nestjs/common';
import {Repository} from "typeorm";
import {Enrollment} from "./entities/enrollment.entity";
import {InjectRepository} from "@nestjs/typeorm";
import {Student} from "../students/entities/student.entity";
import {Batch} from "../batches/entities/batch.entity";
import {UpdateEnrollmentDto} from "./dto/update-enrollment.dto";
import {CreateEnrollmentDto} from "./dto/create-enrollment.dto";

@Injectable()
export class EnrollmentService {
  constructor(
      @InjectRepository(Enrollment)
      private enrolmentRepository: Repository<Enrollment>,
      @InjectRepository(Student)
      private studentRepository: Repository<Student>,
      @InjectRepository(Batch)
      private batchRepository: Repository<Batch>,
  ) {}

  // Create a new enrolment
  async create(createEnrollmentDto: CreateEnrollmentDto): Promise<Enrollment> {
    const student = await this.studentRepository.findOne({where:{id:createEnrollmentDto.studentId}});
    const batch = await this.batchRepository.findOne({where:{id:createEnrollmentDto.batchId}});

    if (!student) {
      throw new NotFoundException('Student not found');
    }
    if (!batch) {
      throw new NotFoundException('Batch not found');
    }

    const enrolment = this.enrolmentRepository.create({
      student,
      batch,
      enrolment_date: createEnrollmentDto.enrolment_date,
    });

    return this.enrolmentRepository.save(enrolment);
  }

  // Get all enrolments
  async findAll(): Promise<Enrollment[]> {
    return this.enrolmentRepository.find({ relations: ['student', 'batch'] });
  }

  // Get an enrolment by ID
  async findOne(id: number): Promise<Enrollment> {
    const enrolment = await this.enrolmentRepository.findOne({
      where: { id },
      relations: ['student', 'batch'],
    });

    if (!enrolment) {
      throw new NotFoundException(`Enrollment with ID ${id} not found`);
    }

    return enrolment;
  }

  // Update an enrolment
  async update(id: number, updateEnrollmentDto: UpdateEnrollmentDto): Promise<Enrollment> {
    const enrolment = await this.findOne(id);

    if (updateEnrollmentDto.studentId) {
      const student = await this.studentRepository.findOne({where:{id:updateEnrollmentDto.studentId}});
      if (!student) {
        throw new NotFoundException('Student not found');
      }
      enrolment.student = student;
    }

    if (updateEnrollmentDto.batchId) {
      const batch = await this.batchRepository.findOne({where:{id:updateEnrollmentDto.batchId}});
      if (!batch) {
        throw new NotFoundException('Batch not found');
      }
      enrolment.batch = batch;
    }

    if (updateEnrollmentDto.enrolment_date) {
      enrolment.enrolment_date = updateEnrollmentDto.enrolment_date;
    }

    return this.enrolmentRepository.save(enrolment);
  }

  // Delete an enrolment
  async remove(id: number): Promise<string> {
    const enrolment = await this.findOne(id);
    await this.enrolmentRepository.remove(enrolment);
    return "deleted";
  }
}
