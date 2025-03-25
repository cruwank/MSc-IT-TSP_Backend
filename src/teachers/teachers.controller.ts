import {Controller, Get, Post, Body, Param, Delete, HttpStatus, Put} from '@nestjs/common';
import { TeachersService } from './teachers.service';
import { CreateTeacherDto } from './dto/create-teacher.dto';
import { UpdateTeacherDto } from './dto/update-teacher.dto';
import {handleApiResponse} from "../common/helpers/response.helper";

@Controller('teachers')
export class TeachersController {
  constructor(private readonly teacherService: TeachersService) {}

  @Post()
  async create(@Body() createTeacherDto: CreateTeacherDto) {
    try {
      const payload = await this.teacherService.create(createTeacherDto);
      return handleApiResponse(
          'Teacher created successfully',
          HttpStatus.CREATED,
          payload,
          null,
      );
    } catch (error) {
      console.error('Error creating teacher:', error);
      return handleApiResponse(
          'Failed to create teacher',
          HttpStatus.INTERNAL_SERVER_ERROR,
          null,
          error,
      );
    }
  }

  // Get all teachers
  @Get()
  async findAll() {
    try {
      const payload = await this.teacherService.findAll();
      return handleApiResponse(
          'Teachers retrieved successfully',
          HttpStatus.OK,
          payload,
          null,
      );
    } catch (error) {
      console.error('Error fetching teachers:', error);
      return handleApiResponse(
          'Failed to fetch teachers',
          HttpStatus.INTERNAL_SERVER_ERROR,
          null,
          error,
      );
    }
  }

  // Get a single teacher by ID
  @Get(':id')
  async findOne(@Param('id') id: number) {
    try {
      const payload = await this.teacherService.findOne(id);
      return handleApiResponse(
          'Teacher retrieved successfully',
          HttpStatus.OK,
          payload,
          null,
      );
    } catch (error) {
      console.error('Error fetching teacher:', error);
      return handleApiResponse(
          'Failed to fetch teacher',
          HttpStatus.INTERNAL_SERVER_ERROR,
          null,
          error,
      );
    }
  }

  // Update an existing teacher
  @Put(':id')
  async update(
      @Param('id') id: number,
      @Body() updateTeacherDto: UpdateTeacherDto,
  ) {
    try {
      const payload = await this.teacherService.update(id, updateTeacherDto);
      return handleApiResponse(
          'Teacher updated successfully',
          HttpStatus.OK,
          payload,
          null,
      );
    } catch (error) {
      console.error('Error updating teacher:', error);
      return handleApiResponse(
          'Failed to update teacher',
          HttpStatus.INTERNAL_SERVER_ERROR,
          null,
          error,
      );
    }
  }

  // Delete a teacher
  @Delete(':id')
  async remove(@Param('id') id: number) {
    try {
      const isDeleted = await this.teacherService.remove(id);
      return handleApiResponse(
          'Teacher deleted successfully',
          HttpStatus.OK,
          isDeleted,
          null,
      );
    } catch (error) {
      console.error('Error deleting teacher:', error);
      return handleApiResponse(
          'Failed to delete teacher',
          HttpStatus.INTERNAL_SERVER_ERROR,
          null,
          error,
      );
    }
  }
}
