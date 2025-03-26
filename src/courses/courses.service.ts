import {ConflictException, Injectable, NotFoundException} from '@nestjs/common';
import {CreateCourseDto} from './dto/create-course.dto';
import {UpdateCourseDto} from './dto/update-course.dto';
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {Course} from "./entities/course.entity";
import {CourseSubject} from "./entities/course-subject.entity";
import {Subject} from "../subjects/entities/subject.entity";
import {AttendanceDto} from "../attendance/dto/attendance.dto";
import {validateParams} from "../common/helpers/validator.helper";
import {paginate} from "../common/helpers/common.helper";
import {CourseDto} from "./dto/course.dto";


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

        await this.courseSubjectRepository
            .createQueryBuilder()
            .delete()
            .where("courseId = :courseId", { courseId: course.id })
            .execute();
        // let courseSubject: CourseSubject[] = [];
        let courseSubjects: CourseSubject[] = [];
        if (updateCourseDto.subjectIdList) {

            for (const subjectId of updateCourseDto.subjectIdList) {
                const subject = await this.subjectRepository.findOne({
                    where: {id: subjectId},
                });

                if (!subject) {
                    throw new NotFoundException(`Subject with ID ${subjectId} not found`);
                }

                console.log(`Linking Course ID ${course.id} with Subject ID ${subjectId}`); // Debugging

                console.log(course)
                const courseSubject = new CourseSubject();
                courseSubject.subject = subject;
                courseSubject.course = course;
                const savedCourseSubject=await this.courseSubjectRepository.save(courseSubject);
                // courseSubject.push(csub)
                courseSubjects.push(savedCourseSubject);
            }
        }

        Object.assign(course, updateCourseDto);
        course.courseSubjects = courseSubjects;
        // course.courseSubjects = courseSubject;
        console.log('load',course)
        const saved = await this.courseRepository.save(course)
        saved.courseSubjects = [];
        return saved;
    }

    // Delete a course
    async remove(id: number): Promise<string> {
        const course = await this.findOne(id);
        await this.courseRepository.remove(course);
        return "deleted";
    }


    async filter(courseDto: CourseDto) {
        console.log(courseDto)
        const {courseId,subjectId,value, page, limit} = courseDto;
        validateParams(courseDto,['page','limit'])


        const query = this.courseRepository
            .createQueryBuilder('courses')
            .leftJoinAndSelect('courses.courseSubjects', 'courseSubjects') // Assuming there is a batch relation
            .leftJoinAndSelect('courseSubjects.subject', 'subject')
            .leftJoinAndSelect('subject.teacher', 'teacher')


        // Filter by status
        if (value) {
            query.andWhere(
                'subject.subject_name LIKE :name OR courses.course_name LIKE :name',
                { name: `%${value}%` }
            );
        }

        if (courseId) {
            query.andWhere('course.id = :courseId', {courseId});
        }

        if (subjectId) {
            query.andWhere('subject.id = :subjectId', {subjectId});
        }

        // query.distinct(true);
        query.orderBy('courses.created_datetime', 'DESC')

        // Pagination
        return paginate(query, page, limit);
    }
}
