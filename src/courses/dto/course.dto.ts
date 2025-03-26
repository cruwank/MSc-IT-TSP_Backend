import {IsNotEmpty, IsOptional, IsString} from "class-validator";

export class CourseDto {


    subjectId: number;
    courseId: number;
    value: string;
    limit: number;
    page: number;

}
