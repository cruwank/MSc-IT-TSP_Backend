import { IsString, IsNotEmpty, IsOptional, IsDateString, IsInt } from 'class-validator';

export class CreateBatchDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsDateString()
    start_date: Date;

    @IsDateString()
    end_date: Date;

    @IsInt()
    courseId: number; // We are referencing course ID for this example
}
