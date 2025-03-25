import {Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {Teacher} from "../../teachers/entities/teacher.entity";
import {Auditable} from "../../common/entity/base-entity";
import {CourseSubject} from "../../courses/entities/course-subject.entity";
import {ClassSchedule} from "../../class-schedule/entities/class-schedule.entity";

@Entity('subjects')
export class Subject extends Auditable{
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 100, unique: true, nullable: false })
    subject_name: string;

    @Column({ type: 'text', nullable: true })
    description: string;

    @ManyToOne(() => Teacher, (obj) => obj.subjects, { nullable: false })
    teacher: Teacher;

    @OneToMany(() => CourseSubject, (obj) => obj.subject)
    courseSubjects: CourseSubject[];


    @OneToMany(() => ClassSchedule, (obj) => obj.batch)
    classSchedules: ClassSchedule[];
}
