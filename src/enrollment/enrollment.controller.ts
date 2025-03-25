import {Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus, Put} from '@nestjs/common';
import { EnrollmentService } from './enrollment.service';
import { CreateEnrollmentDto } from './dto/create-enrollment.dto';
import { UpdateEnrollmentDto } from './dto/update-enrollment.dto';
import {handleApiResponse} from "../common/helpers/response.helper";

@Controller('enrollments')
export class EnrollmentController {
  constructor(private readonly enrolmentService: EnrollmentService) {}

  @Post()
  async create(@Body() createEnrolmentDto: CreateEnrollmentDto) {
    try {
      const payload = await this.enrolmentService.create(createEnrolmentDto);
      return handleApiResponse(
          'Enrollment created successfully',
          HttpStatus.CREATED,
          payload,
          null,
      );
    } catch (error) {
      console.error('Error creating enrolment:', error);
      return handleApiResponse(
          'Failed to create enrolment',
          HttpStatus.INTERNAL_SERVER_ERROR,
          null,
          error,
      );
    }
  }

  // Get all enrolments
  @Get()
  async findAll() {
    try {
      const payload = await this.enrolmentService.findAll();
      return handleApiResponse(
          'Enrolments retrieved successfully',
          HttpStatus.OK,
          payload,
          null,
      );
    } catch (error) {
      console.error('Error fetching enrolments:', error);
      return handleApiResponse(
          'Failed to fetch enrolments',
          HttpStatus.INTERNAL_SERVER_ERROR,
          null,
          error,
      );
    }
  }

  // Get a single enrolment by ID
  @Get(':id')
  async findOne(@Param('id') id: number) {
    try {
      const payload = await this.enrolmentService.findOne(id);
      return handleApiResponse(
          'Enrollment retrieved successfully',
          HttpStatus.OK,
          payload,
          null,
      );
    } catch (error) {
      console.error('Error fetching enrolment:', error);
      return handleApiResponse(
          'Failed to fetch enrolment',
          HttpStatus.INTERNAL_SERVER_ERROR,
          null,
          error,
      );
    }
  }

  // Update an existing enrolment
  @Put(':id')
  async update(
      @Param('id') id: number,
      @Body() updateEnrolmentDto: UpdateEnrollmentDto,
  ) {
    try {
      const payload = await this.enrolmentService.update(id, updateEnrolmentDto);
      return handleApiResponse(
          'Enrollment updated successfully',
          HttpStatus.OK,
          payload,
          null,
      );
    } catch (error) {
      console.error('Error updating enrolment:', error);
      return handleApiResponse(
          'Failed to update enrolment',
          HttpStatus.INTERNAL_SERVER_ERROR,
          null,
          error,
      );
    }
  }

  // Delete an enrolment
  @Delete(':id')
  async remove(@Param('id') id: number) {
    try {
      const isDeleted = await this.enrolmentService.remove(id);
      return handleApiResponse(
          'Enrollment deleted successfully',
          HttpStatus.OK,
          isDeleted,
          null,
      );
    } catch (error) {
      console.error('Error deleting enrolment:', error);
      return handleApiResponse(
          'Failed to delete enrolment',
          HttpStatus.INTERNAL_SERVER_ERROR,
          null,
          error,
      );
    }
  }
}
