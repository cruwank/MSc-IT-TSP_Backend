import {
    CreateDateColumn,
    UpdateDateColumn,
    VersionColumn,
    Column,
    PrimaryGeneratedColumn
} from 'typeorm';

export abstract class Auditable {

    @Column({ name: 'created_by', nullable: true })
    created_by: number;

    @CreateDateColumn({ name: 'created_datetime', type: 'timestamp' })
    created_datetime: Date;

    @Column({ name: 'modified_by', nullable: true })
    modified_by: number;

    @UpdateDateColumn({ name: 'modified_datetime', type: 'timestamp'})
    modified_datetime: Date;

    @VersionColumn({ name: 'version' })
    version: number;
}
