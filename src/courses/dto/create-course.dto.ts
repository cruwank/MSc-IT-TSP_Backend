import {IsNotEmpty, IsOptional, IsString} from "class-validator";

export class CreateCourseDto {
    @IsString()
    @IsNotEmpty()
    course_name: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsOptional()
    @IsString()
    duration?: string;

    @IsOptional()
    subjectIdList?: number[];

    courseId:number;
    limit:number;
    page:number;

}
