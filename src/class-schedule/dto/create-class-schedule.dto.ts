// create-class-schedule.dto.ts
import { IsString, IsNotEmpty, IsDateString, IsInt } from 'class-validator';

export class CreateClassScheduleDto {
    @IsInt()
    batchId: number;

    @IsInt()
    subjectId: number;

    @IsDateString()
    class_date: Date;
    start_time: string;
    end_time: string;
}
