import {Column, Entity, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {Student} from "../../students/entities/student.entity";
import {ClassSchedule} from "../../class-schedule/entities/class-schedule.entity";
import {Auditable} from "../../common/entity/base-entity";

@Entity('attendance')
export class Attendance extends Auditable {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Student, (obj) => obj.attendances, {nullable: false})
    student: Student;

    @ManyToOne(() => ClassSchedule, (obj) => obj.attendances, {nullable: false})
    schedule: ClassSchedule;

    @Column({type: 'enum', enum: ['present', 'absent', 'late'], nullable: false})
    status: 'present' | 'absent' | 'late';

    @Column({type: 'text', nullable: true})
    remarks: string;
}
