// create-enrolment.dto.ts
import { IsInt, IsDateString } from 'class-validator';

export class CreateEnrollmentDto {
    @IsInt()
    studentId: number;

    @IsInt()
    batchId: number;

    @IsDateString()
    enrolment_date: Date;
}
