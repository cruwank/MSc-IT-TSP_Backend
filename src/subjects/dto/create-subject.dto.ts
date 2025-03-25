// create-subject.dto.ts
import { IsString, IsNotEmpty, IsOptional, IsEnum, IsInt } from 'class-validator';

export class CreateSubjectDto {
    @IsString()
    @IsNotEmpty()
    subject_name: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsInt()
    teacherId: number; // We are referencing teacher ID for this example
}
