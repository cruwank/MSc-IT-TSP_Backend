import {Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {Subject} from "../../subjects/entities/subject.entity";
import {Attendance} from "../../attendance/entities/attendance.entity";
import {Auditable} from "../../common/entity/base-entity";
import {Batch} from "../../batches/entities/batch.entity";

@Entity('class_schedules')
export class ClassSchedule extends Auditable{
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Batch, (batch) => batch.classSchedules, { nullable: false })
    batch: Batch;

    @ManyToOne(() => Subject, (subject) => subject.classSchedules, { nullable: false })
    subject: Subject;

    @Column({ type: 'date', nullable: false })
    class_date: Date;

    @Column({ type: 'time', nullable: false })
    start_time: string;

    @Column({ type: 'time', nullable: false })
    end_time: string;

    @Column({ type: 'varchar', length: 100, nullable: false })
    qr_code: string;

    @OneToMany(() => Attendance, (attendance) => attendance.student)
    attendances: Attendance[];



}
