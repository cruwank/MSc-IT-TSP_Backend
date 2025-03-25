import {IsEnum, IsNotEmpty, IsOptional, IsPhoneNumber, IsString} from 'class-validator';

export class AttendanceDto {

    subjectId: number;
    courseId: number;
    value: string;
    limit: number;
    page: number;
}
