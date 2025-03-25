// create-user.dto.ts
import { IsString, IsEmail, IsNotEmpty, IsEnum, IsOptional, IsPhoneNumber, IsDateString } from 'class-validator';

export class CreateUserDto {
    @IsString()
    @IsNotEmpty()
    username: string;

    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    password: string;

    @IsEnum(['admin', 'coordinator', 'support'])
    @IsNotEmpty()
    role: 'admin' | 'coordinator' | 'support';

    @IsString()
    @IsNotEmpty()
    first_name: string;

    @IsString()
    @IsNotEmpty()
    last_name: string;

    @IsPhoneNumber()
    @IsOptional()
    phone_number?: string;

    @IsString()
    @IsOptional()
    address?: string;

    @IsDateString()
    @IsOptional()
    date_of_birth?: Date;

    @IsEnum(['M', 'F', 'O'])
    @IsOptional()
    gender?: 'M' | 'F' | 'O';
}

