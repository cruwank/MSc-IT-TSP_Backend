import {ConflictException, Injectable, NotFoundException} from '@nestjs/common';
import {CreateCourseDto} from './dto/create-course.dto';
import {UpdateCourseDto} from './dto/update-course.dto';
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {Course} from "./entities/course.entity";
import {CourseSubject} from "./entities/course-subject.entity";
import {Subject} from "../subjects/entities/subject.entity";


@Injectable()
export class CoursesService {

    constructor(
        @InjectRepository(Course)
        private courseRepository: Repository<Course>,
        @InjectRepository(CourseSubject)
        private courseSubjectRepository: Repository<CourseSubject>,
        @InjectRepository(Subject)
        private subjectRepository: Repository<Subject>,
    ) {
    }

    async create(createCourseDto: CreateCourseDto): Promise<Course> {
        try {
            const course = this.courseRepository.create(createCourseDto);
            const courseSaved = await this.courseRepository.save(course)
            if (createCourseDto.subjectIdList) {
                for (const subjectId of createCourseDto.subjectIdList) {
                    const subject = await this.subjectRepository.findOne({
                        where: {id: subjectId},
                    });

                    if (!subject) {
                        throw new NotFoundException(`Subject with ID ${subjectId} not found`);
                    }
                    const courseSubject = new CourseSubject();
                    courseSubject.subject = subject;
                    courseSubject.course = courseSaved;
                    await this.courseSubjectRepository.save(courseSubject);
                }
            }
            return courseSaved;
        } catch (e) {
            throw new ConflictException(e.message);
        }
    }

    // Get all courses
    async findAll(): Promise<Course[]> {
        return this.courseRepository.find();
    }

    // Get a course by ID
    async findOne(id: number): Promise<Course> {
        const course = await this.courseRepository.findOne({where: {id: id}, relations: ['courseSubjects.subject']});
        if (!course) {
            throw new NotFoundException(`Course with ID ${id} not found`);
        }
        return course;
    }

    // Update a course
    async update(id: number, updateCourseDto: UpdateCourseDto): Promise<Course> {
        const course = await this.findOne(id);
        Object.assign(course, updateCourseDto);
        return this.courseRepository.save(course);
    }

    // Delete a course
    async remove(id: number): Promise<string> {
        const course = await this.findOne(id);
        await this.courseRepository.remove(course);
        return "deleted";
    }
}
