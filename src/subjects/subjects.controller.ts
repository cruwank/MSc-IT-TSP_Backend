import {Controller, Get, Post, Body, Param, Delete, HttpStatus, Put} from '@nestjs/common';
import { SubjectsService } from './subjects.service';
import { CreateSubjectDto } from './dto/create-subject.dto';
import { UpdateSubjectDto } from './dto/update-subject.dto';
import {handleApiResponse} from "../common/helpers/response.helper";

@Controller('subjects')
export class SubjectsController {
  constructor(private readonly subjectService: SubjectsService) {}

  @Post()
  async create(@Body() createSubjectDto: CreateSubjectDto) {
    try {
      const payload = await this.subjectService.create(createSubjectDto);
      return handleApiResponse(
          'Subject created successfully',
          HttpStatus.CREATED,
          payload,
          null,
      );
    } catch (error) {
      console.error('Error creating subject:', error);
      return handleApiResponse(
          'Failed to create subject',
          HttpStatus.INTERNAL_SERVER_ERROR,
          null,
          error,
      );
    }
  }

  // Get all subjects
  @Get()
  async findAll() {
    try {
      const payload = await this.subjectService.findAll();
      return handleApiResponse(
          'Subjects retrieved successfully',
          HttpStatus.OK,
          payload,
          null,
      );
    } catch (error) {
      console.error('Error fetching subjects:', error);
      return handleApiResponse(
          'Failed to fetch subjects',
          HttpStatus.INTERNAL_SERVER_ERROR,
          null,
          error,
      );
    }
  }

  // Get a single subject by ID
  @Get(':id')
  async findOne(@Param('id') id: number) {
    try {
      const payload = await this.subjectService.findOne(id);
      return handleApiResponse(
          'Subject retrieved successfully',
          HttpStatus.OK,
          payload,
          null,
      );
    } catch (error) {
      console.error('Error fetching subject:', error);
      return handleApiResponse(
          'Failed to fetch subject',
          HttpStatus.INTERNAL_SERVER_ERROR,
          null,
          error,
      );
    }
  }

  // Update an existing subject
  @Put(':id')
  async update(
      @Param('id') id: number,
      @Body() updateSubjectDto: UpdateSubjectDto,
  ) {
    try {
      const payload = await this.subjectService.update(id, updateSubjectDto);
      return handleApiResponse(
          'Subject updated successfully',
          HttpStatus.OK,
          payload,
          null,
      );
    } catch (error) {
      console.error('Error updating subject:', error);
      return handleApiResponse(
          'Failed to update subject',
          HttpStatus.INTERNAL_SERVER_ERROR,
          null,
          error,
      );
    }
  }

  // Delete a subject
  @Delete(':id')
  async remove(@Param('id') id: number) {
    try {
      const isDeleted =  await this.subjectService.remove(id);
      return handleApiResponse(
          'Subject deleted successfully',
          HttpStatus.OK,
          isDeleted,
          null,
      );
    } catch (error) {
      console.error('Error deleting subject:', error);
      return handleApiResponse(
          'Failed to delete subject',
          HttpStatus.INTERNAL_SERVER_ERROR,
          null,
          error,
      );
    }
  }
}
