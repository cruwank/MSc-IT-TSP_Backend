import {IsEnum, IsNotEmpty, IsOptional, IsPhoneNumber, IsString} from 'class-validator';

export class AttendanceDto {

    studentId: number;
    attendanceId: number;
    subjectId: number;
    courseId: number;
    value: string;
    date: string;
    limit: number;
    page: number;
}
