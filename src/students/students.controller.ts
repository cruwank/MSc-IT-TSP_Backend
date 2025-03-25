import {Controller, Get, Post, Body, Param, Delete, HttpStatus, Put} from '@nestjs/common';
import { StudentsService } from './students.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import {handleApiResponse} from "../common/helpers/response.helper";
import {StudentDto} from "./dto/student.dto";
import {ClassScheduleDto} from "../class-schedule/dto/class-schedule.dto";
import {Public} from "../auth/decorators/public.decorator";
import {User} from "../auth/decorators/user.decorator";

@Controller('students')
export class StudentsController {
  constructor(private readonly studentService: StudentsService) {}

  @Post()
  async create(@Body() createStudentDto: CreateStudentDto) {
    try {
      const payload = await this.studentService.create(createStudentDto);
      return handleApiResponse(
          'Student created successfully',
          HttpStatus.CREATED,
          payload,
          null,
      );
    } catch (error) {
      console.error('Error creating student:', error);
      return handleApiResponse(
          'Failed to create student',
          HttpStatus.INTERNAL_SERVER_ERROR,
          null,
          error,
      );
    }
  }

  // Get all students
  @Get()
  async findAll() {
    try {
      const payload = await this.studentService.findAll();
      return handleApiResponse(
          'Students retrieved successfully',
          HttpStatus.OK,
          payload,
          null,
      );
    } catch (error) {
      console.error('Error fetching students:', error);
      return handleApiResponse(
          'Failed to fetch students',
          HttpStatus.INTERNAL_SERVER_ERROR,
          null,
          error,
      );
    }
  }

  // Get a single student by ID
  @Get(':id')
  async findOne(@Param('id') id: number) {
    try {
      const payload = await this.studentService.findOne(id);
      return handleApiResponse(
          'Student retrieved successfully',
          HttpStatus.OK,
          payload,
          null,
      );
    } catch (error) {
      console.error('Error fetching student:', error);
      return handleApiResponse(
          'Failed to fetch student',
          HttpStatus.INTERNAL_SERVER_ERROR,
          null,
          error,
      );
    }
  }

  // Update an existing student
  @Put(':id')
  async update(
      @Param('id') id: number,
      @Body() updateStudentDto: UpdateStudentDto,
      @User() user: any
  ) {
    try {
      const payload = await this.studentService.update(id, updateStudentDto,user);
      return handleApiResponse(
          'Student updated successfully',
          HttpStatus.OK,
          payload,
          null,
      );
    } catch (error) {
      console.error('Error updating student:', error);
      return handleApiResponse(
          'Failed to update student',
          HttpStatus.INTERNAL_SERVER_ERROR,
          null,
          error,
      );
    }
  }

  // Delete a student
  @Delete(':id')
  async remove(@Param('id') id: number) {
    try {
      await this.studentService.remove(id);
      return handleApiResponse(
          'Student deleted successfully',
          HttpStatus.OK,
          null,
          null,
      );
    } catch (error) {
      console.error('Error deleting student:', error);
      return handleApiResponse(
          'Failed to delete student',
          HttpStatus.INTERNAL_SERVER_ERROR,
          null,
          error,
      );
    }
  }

  @Public()
  @Post('resend/otp')
  async resendOtp(@Body() studentDto: StudentDto) {
    try {
      const payload = await this.studentService.resendOtp(studentDto);
      return handleApiResponse(
          'OTP sent successfully',
          HttpStatus.CREATED,
          payload,
          null,
      );
    } catch (error) {
      console.error('Error creating student:', error);
      return handleApiResponse(
          'Failed to resend OTP',
          HttpStatus.INTERNAL_SERVER_ERROR,
          null,
          error,
      );
    }
  }

  @Public()
  @Post('validate/otp')
  async validateOtp(@Body() studentDto: StudentDto) {
    try {
      const payload = await this.studentService.validateOTP(studentDto);
      return handleApiResponse(
          'Student validated successfully',
          HttpStatus.CREATED,
          payload,
          null,
      );
    } catch (error) {
      console.error('Error creating student:', error);
      return handleApiResponse(
          'Failed to validate student',
          HttpStatus.INTERNAL_SERVER_ERROR,
          null,
          error,
      );
    }
  }


  @Post('filter')
  async filter(@Body() studentDto: StudentDto) {
    try {
      const payload = await this.studentService.filter(studentDto);
      return handleApiResponse(
          'Student filter successfully',
          HttpStatus.OK,
          payload,
          null,
      );
    } catch (error) {
      console.error('Error creating course:', error);
      return handleApiResponse(
          'Failed to filter students',
          HttpStatus.INTERNAL_SERVER_ERROR,
          null,
          error,
      );
    }
  }
}
