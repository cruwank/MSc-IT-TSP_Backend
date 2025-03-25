import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateAttendanceDto {
    @IsNotEmpty()
    studentId: number;

    @IsOptional()
    scheduleId: number;

    @IsString()
    @IsOptional()
    remarks?: string;

    @IsString()
    @IsNotEmpty()
    qrCode?: string;
}
