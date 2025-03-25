// create-user.dto.ts
import { IsString, IsEmail, IsNotEmpty, IsEnum, IsOptional, IsPhoneNumber, IsDateString } from 'class-validator';

export class AuthDto {
    @IsString()
    @IsNotEmpty()
    username: string;

    @IsString()
    @IsNotEmpty()
    password: string;

}

