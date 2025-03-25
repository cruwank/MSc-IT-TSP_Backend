import {Column, Entity, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {Student} from "../../students/entities/student.entity";
import {Auditable} from "../../common/entity/base-entity";
import {Batch} from "../../batches/entities/batch.entity";

@Entity('enrollments')
export class Enrollment extends Auditable{
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Student, (student) => student.enrolments, { nullable: false })
    student: Student;

    @ManyToOne(() => Batch, (batch) => batch.enrollments, { nullable: false })
    batch: Batch;

    @Column({ type: 'date', nullable: false })
    enrolment_date: Date;

}
