import {Controller, Get, Post, Body, Param, Delete, HttpStatus, Put} from '@nestjs/common';
import { CoursesService } from './courses.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import {handleApiResponse} from "../common/helpers/response.helper";
import {ClassScheduleDto} from "../class-schedule/dto/class-schedule.dto";

@Controller('courses')
export class CoursesController {
  constructor(private readonly courseService: CoursesService) {}

  @Post()
  async create(@Body() createCourseDto: CreateCourseDto) {
    try {
      const payload = await this.courseService.create(createCourseDto);
      return handleApiResponse(
          'Course created successfully',
          HttpStatus.CREATED,
          payload,
          null,
      );
    } catch (error) {
      console.error('Error creating course:', error);
      return handleApiResponse(
          'Failed to create course',
          HttpStatus.INTERNAL_SERVER_ERROR,
          null,
          error,
      );
    }
  }


  // Get all courses
  @Get()
  async findAll() {
    try {
      const payload = await this.courseService.findAll();
      return handleApiResponse(
          'Courses retrieved successfully',
          HttpStatus.OK,
          payload,
          null,
      );
    } catch (error) {
      console.error('Error fetching courses:', error);
      return handleApiResponse(
          'Failed to fetch courses',
          HttpStatus.INTERNAL_SERVER_ERROR,
          null,
          error,
      );
    }
  }

  // Get a single course by ID
  @Get(':id')
  async findOne(@Param('id') id: number) {
    try {
      const payload = await this.courseService.findOne(id);
      return handleApiResponse(
          'Course retrieved successfully',
          HttpStatus.OK,
          payload,
          null,
      );
    } catch (error) {
      console.error('Error fetching course:', error);
      return handleApiResponse(
          'Failed to fetch course',
          HttpStatus.INTERNAL_SERVER_ERROR,
          null,
          error,
      );
    }
  }

  // Update an existing course
  @Put(':id')
  async update(
      @Param('id') id: number,
      @Body() updateCourseDto: UpdateCourseDto,
  ) {
    try {
      const payload = await this.courseService.update(id, updateCourseDto);
      return handleApiResponse(
          'Course updated successfully',
          HttpStatus.OK,
          payload,
          null,
      );
    } catch (error) {
      console.error('Error updating course:', error);
      return handleApiResponse(
          'Failed to update course',
          HttpStatus.INTERNAL_SERVER_ERROR,
          null,
          error,
      );
    }
  }

  // Delete a course
  @Delete(':id')
  async remove(@Param('id') id: number) {
    try {
      const isDeleted = await this.courseService.remove(id);
      return handleApiResponse(
          'Course deleted successfully',
          HttpStatus.OK,
          isDeleted,
          null,
      );
    } catch (error) {
      console.error('Error deleting course:', error);
      return handleApiResponse(
          'Failed to delete course',
          HttpStatus.INTERNAL_SERVER_ERROR,
          null,
          error,
      );
    }
  }

}
