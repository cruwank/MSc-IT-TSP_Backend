import {Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {Course} from "./course.entity";
import {Subject} from "../../subjects/entities/subject.entity";
import {Auditable} from "../../common/entity/base-entity";

@Entity('course_subjects')
export class CourseSubject extends Auditable{

    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Course, (obj) => obj.courseSubjects, { eager: true })
    @JoinColumn({ name: 'courseId' })
    course: Course;

    @ManyToOne(() => Subject, (obj) => obj.courseSubjects)
    @JoinColumn({ name: 'subjectId' })
    subject: Subject;

}
