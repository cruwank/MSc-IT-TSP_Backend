// create-teacher.dto.ts
import { IsString, IsEmail, IsOptional, IsEnum, IsPhoneNumber } from 'class-validator';

export class CreateTeacherDto {
    @IsEmail()
    email: string;

    @IsString()
    first_name: string;

    @IsString()
    last_name: string;

    @IsOptional()
    @IsPhoneNumber()
    phone_number?: string;

    @IsOptional()
    @IsString()
    address?: string;

    @IsOptional()
    @IsEnum(['M', 'F', 'O'])
    gender?: 'M' | 'F' | 'O';
}
