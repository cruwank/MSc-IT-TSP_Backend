// create-student.dto.ts
import {IsString, IsEmail, IsOptional, IsEnum, IsPhoneNumber, IsDateString} from 'class-validator';

export class StudentDto {

    @IsOptional()
    @IsPhoneNumber()
    phone_number?: string;
    otp_code?: string;

    batchId: number;
    courseId: number;
    value: string;
    limit: number;
    page: number;

}
