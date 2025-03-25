import {Column, Entity, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {Auditable} from "../../common/entity/base-entity";
import {Batch} from "../../batches/entities/batch.entity";
import {CourseSubject} from "./course-subject.entity";

@Entity('courses')
export class Course extends Auditable{
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 100, unique: true, nullable: false })
    course_name: string;

    @Column({ type: 'text', nullable: true })
    description: string;

    @Column({ type: 'varchar', length: 100, nullable: false })
    duration: string;

    @OneToMany(() => Batch, (o) => o.course)
    batches: Batch[];

    @OneToMany(() => CourseSubject, (o) => o.course)
    courseSubjects: CourseSubject[];


}

