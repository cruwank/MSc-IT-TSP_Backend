import {Attendance} from "../../attendance/entities/attendance.entity";
import {Column, Entity, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {Auditable} from "../../common/entity/base-entity";
import {Enrollment} from "../../enrollment/entities/enrollment.entity";

@Entity('students')
export class Student extends Auditable{
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 50, nullable: false })
    first_name: string;

    @Column({ type: 'varchar', length: 50, nullable: false })
    last_name: string;

    @Column({ type: 'date', nullable: true })
    date_of_birth: Date;

    @Column({ type: 'enum', enum: ['M', 'F', 'O'], nullable: true })
    gender: 'M' | 'F' | 'O';

    @Column({ type: 'enum', enum: ['ACTIVE', 'INACTIVE'], nullable: true })
    status: 'ACTIVE' | 'INACTIVE' ;

    @Column({ type: 'varchar', length: 15, nullable: true })
    phone_number: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    address: string;

    @Column({ type: 'varchar', length: 100, unique: true, nullable: false })
    email: string;

    @Column({ type: 'varchar', length: 10, nullable: false })
    otp_code: string;

    @OneToMany(() => Attendance, (obj) => obj.student)
    attendances: Attendance[];

    @OneToMany(() => Enrollment, (obj) => obj.student)
    enrolments: Enrollment[];
}
