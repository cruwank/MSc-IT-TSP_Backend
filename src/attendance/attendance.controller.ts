import {Controller, Get, Post, Body, HttpStatus, Res} from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { CreateAttendanceDto } from './dto/create-attendance.dto';
import {handleApiResponse} from "../common/helpers/response.helper";
import {StudentDto} from "../students/dto/student.dto";
import {AttendanceDto} from "./dto/attendance.dto";
import type { Response } from 'express';
import {Public} from "../auth/decorators/public.decorator";
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

  @Public()
  @Post('filter/report')
  async filterReport(@Body() attendanceDto: AttendanceDto,@Res() res: Response) {
    try {
      const stream = await this.attendanceService.filterDownload(attendanceDto);
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename=attendance.csv');

      // Send CSV as response
      res.send(stream);
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
