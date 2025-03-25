import {Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus, Put, Res} from '@nestjs/common';
import { ClassScheduleService } from './class-schedule.service';
import { CreateClassScheduleDto } from './dto/create-class-schedule.dto';
import { UpdateClassScheduleDto } from './dto/update-class-schedule.dto';
import {handleApiResponse} from "../common/helpers/response.helper";
import {ClassScheduleDto} from "./dto/class-schedule.dto";
import {FastifyReply} from "fastify/types/reply";

@Controller('class-schedule')
export class ClassScheduleController {
  constructor(private readonly classScheduleService: ClassScheduleService) {}
  @Post()
  async create(@Body() createClassScheduleDto: CreateClassScheduleDto) {
    try {
      const payload = await this.classScheduleService.create(createClassScheduleDto);
      return handleApiResponse(
          'Class schedule created successfully',
          HttpStatus.CREATED,
          payload,
          null,
      );
    } catch (error) {
      console.error('Error creating class schedule:', error);
      return handleApiResponse(
          'Failed to create class schedule',
          HttpStatus.INTERNAL_SERVER_ERROR,
          null,
          error,
      );
    }
  }

  // Get all class schedules
  @Get()
  async findAll() {
    try {
      const payload = await this.classScheduleService.findAll();
      return handleApiResponse(
          'Class schedules retrieved successfully',
          HttpStatus.OK,
          payload,
          null,
      );
    } catch (error) {
      console.error('Error fetching class schedules:', error);
      return handleApiResponse(
          'Failed to fetch class schedules',
          HttpStatus.INTERNAL_SERVER_ERROR,
          null,
          error,
      );
    }
  }

  // Get a single class schedule by ID
  @Get(':id')
  async findOne(@Param('id') id: number) {
    try {
      const payload = await this.classScheduleService.findOne(id);
      return handleApiResponse(
          'Class schedule retrieved successfully',
          HttpStatus.OK,
          payload,
          null,
      );
    } catch (error) {
      console.error('Error fetching class schedule:', error);
      return handleApiResponse(
          'Failed to fetch class schedule',
          HttpStatus.INTERNAL_SERVER_ERROR,
          null,
          error,
      );
    }
  }

  // Update an existing class schedule
  @Put(':id')
  async update(
      @Param('id') id: number,
      @Body() updateClassScheduleDto: UpdateClassScheduleDto,
  ) {
    try {
      const payload = await this.classScheduleService.update(id, updateClassScheduleDto);
      return handleApiResponse(
          'Class schedule updated successfully',
          HttpStatus.OK,
          payload,
          null,
      );
    } catch (error) {
      console.error('Error updating class schedule:', error);
      return handleApiResponse(
          'Failed to update class schedule',
          HttpStatus.INTERNAL_SERVER_ERROR,
          null,
          error,
      );
    }
  }

  // Delete a class schedule
  @Delete(':id')
  async remove(@Param('id') id: number) {
    try {
      const isDeleted = await this.classScheduleService.remove(id);
      return handleApiResponse(
          'Class schedule deleted successfully',
          HttpStatus.OK,
          isDeleted,
          null,
      );
    } catch (error) {
      console.error('Error deleting class schedule:', error);
      return handleApiResponse(
          'Failed to delete class schedule',
          HttpStatus.INTERNAL_SERVER_ERROR,
          null,
          error,
      );
    }
  }

  @Post('filter')
  async filter(@Body() courseDto: ClassScheduleDto) {
    try {
      const payload = await this.classScheduleService.filter(courseDto);
      return handleApiResponse(
          'Schedule filter successfully',
          HttpStatus.OK,
          payload,
          null,
      );
    } catch (error) {
      console.error('Error creating course:', error);
      return handleApiResponse(
          'Failed to filter schedule',
          HttpStatus.INTERNAL_SERVER_ERROR,
          null,
          error,
      );
    }
  }

  @Get('qr/view/:id/:width/:margin')
  async viewQr(@Param('id') id: number,@Param('width') width: number,@Param('margin') margin: number,@Res() res: FastifyReply) {
    try {
      const qrWidth = width ? parseInt(String(width), 10) : 300; // Default width 300
      const buffer = await this.classScheduleService.viewQr(id,qrWidth,margin);
      res.header('Content-Type', 'image/png').send(buffer);
    } catch (error) {
      console.error('Error fetching class schedule:', error);
      return handleApiResponse(
          'Failed to fetch class schedule',
          HttpStatus.INTERNAL_SERVER_ERROR,
          null,
          error,
      );
    }
  }

}
