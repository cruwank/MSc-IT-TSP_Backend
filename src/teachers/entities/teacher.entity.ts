import {Column, Entity, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {Attendance} from "../../attendance/entities/attendance.entity";
import {Subject} from "../../subjects/entities/subject.entity";
import {Auditable} from "../../common/entity/base-entity";

@Entity('teachers')
export class Teacher extends Auditable{
    @PrimaryGeneratedColumn()
    id: number;

    @Column({type: 'varchar', length: 100, unique: true, nullable: false})
    email: string;

    @Column({type: 'varchar', length: 50, nullable: false})
    first_name: string;

    @Column({type: 'varchar', length: 50, nullable: false})
    last_name: string;

    @Column({type: 'varchar', length: 15, nullable: true})
    phone_number: string;

    @Column({type: 'varchar', length: 255, nullable: true})
    address: string;

    @Column({type: 'enum', enum: ['M', 'F', 'O'], nullable: true})
    gender: 'M' | 'F' | 'O';

    @OneToMany(() => Subject, (obj) => obj.id)
    subjects: Subject[];
}
