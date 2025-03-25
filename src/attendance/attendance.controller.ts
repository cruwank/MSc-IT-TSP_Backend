import {Controller, Get, Post, Body, HttpStatus} from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { CreateAttendanceDto } from './dto/create-attendance.dto';
import {handleApiResponse} from "../common/helpers/response.helper";
import {StudentDto} from "../students/dto/student.dto";
import {AttendanceDto} from "./dto/attendance.dto";

@Controller('attendance')
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @Post()
  async create(@Body() createAttendanceDto: CreateAttendanceDto) {
    try {
      const payload = await this.attendanceService.create(createAttendanceDto);
      return handleApiResponse(
          'Attendance record created successfully',
          HttpStatus.CREATED,
          payload,
          null,
      );
    } catch (error) {
      console.error('Error creating attendance record:', error);
      return handleApiResponse(
          'Failed to create attendance record',
          HttpStatus.INTERNAL_SERVER_ERROR,
          null,
          error,
      );
    }
  }

  @Get()
  async findAll() {
    try {
      const payload = await this.attendanceService.findAll();
      return handleApiResponse(
          'Attendance records retrieved successfully',
          HttpStatus.OK,
          payload,
          null,
      );
    } catch (error) {
      console.error('Error fetching attendance records:', error);
      return handleApiResponse(
          'Failed to fetch attendance records',
          HttpStatus.INTERNAL_SERVER_ERROR,
          null,
          error,
      );
    }
  }

  @Post('filter')
  async filter(@Body() attendanceDto: AttendanceDto) {
    try {
      const payload = await this.attendanceService.filter(attendanceDto);
      return handleApiResponse(
          'Attendance filter successfully',
          HttpStatus.OK,
          payload,
          null,
      );
    } catch (error) {
      console.error('Error creating course:', error);
      return handleApiResponse(
          'Failed to filter attendance',
          HttpStatus.INTERNAL_SERVER_ERROR,
          null,
          error,
      );
    }
  }

}
