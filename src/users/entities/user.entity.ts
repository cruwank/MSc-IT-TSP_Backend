import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import {Auditable} from "../../common/entity/base-entity";

@Entity('users')
export class User extends Auditable{
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 50, unique: true, nullable: false })
  username: string;

  @Column({ type: 'varchar', length: 100, unique: true, nullable: false })
  email: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  password: string;

  @Column({ type: 'enum', enum: ['admin', 'coordinator', 'support'], nullable: false })
  role: 'admin' | 'coordinator' | 'support';

  @Column({ type: 'varchar', length: 50, nullable: false })
  first_name: string;

  @Column({ type: 'varchar', length: 50, nullable: false })
  last_name: string;

  @Column({ type: 'varchar', length: 15, nullable: true })
  phone_number: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  address: string;

  @Column({ type: 'date', nullable: true })
  date_of_birth: Date;

  @Column({ type: 'enum', enum: ['M', 'F', 'O'], nullable: true })
  gender: 'M' | 'F' | 'O';

}
