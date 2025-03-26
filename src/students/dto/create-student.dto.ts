// create-student.dto.ts
import { IsString, IsEmail, IsOptional, IsEnum, IsPhoneNumber, IsDateString } from 'class-validator';

export class CreateStudentDto {

    @IsString()
    first_name: string;

    @IsString()
    last_name: string;

    @IsOptional()
    @IsDateString()
    date_of_birth?: Date;

    @IsOptional()
    @IsEnum(['M', 'F', 'O'])
    gender?: 'M' | 'F' | 'O';

    @IsOptional()
    @IsEnum(['ACTIVE', 'INACTIVE'])
    status?: 'ACTIVE'|'INACTIVE'

    @IsOptional()
    otp_code?: string;

    @IsOptional()
    @IsPhoneNumber()
    phone_number?: string;

    @IsOptional()
    @IsString()
    address?: string;

    @IsEmail()
    email: string;

}
