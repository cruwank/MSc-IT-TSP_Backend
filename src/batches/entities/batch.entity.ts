import {Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {Course} from "../../courses/entities/course.entity";
import {Auditable} from "../../common/entity/base-entity";
import {Enrollment} from "../../enrollment/entities/enrollment.entity";
import {ClassSchedule} from "../../class-schedule/entities/class-schedule.entity";

@Entity('batches')
export class Batch extends  Auditable{
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 100, unique: true, nullable: false })
    name: string;

    @Column({ type: 'date', nullable: false })
    start_date: Date;

    @Column({ type: 'date', nullable: false })
    end_date: Date;

    @ManyToOne(() => Course, (obj) => obj.batches)
    course: Course;

    @OneToMany(() => Enrollment, (obj) => obj.batch)
    enrollments: Enrollment[];

    @OneToMany(() => ClassSchedule, (obj) => obj.batch)
    classSchedules: ClassSchedule[];

}
