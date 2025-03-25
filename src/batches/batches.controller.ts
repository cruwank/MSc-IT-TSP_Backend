import {Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus, Put} from '@nestjs/common';
import { BatchesService } from './batches.service';
import { CreateBatchDto } from './dto/create-batch.dto';
import { UpdateBatchDto } from './dto/update-batch.dto';
import {handleApiResponse} from "../common/helpers/response.helper";

@Controller('batches')
export class BatchesController {
  constructor(private readonly batchService: BatchesService) {}
  @Post()
  async create(@Body() createBatchDto: CreateBatchDto) {
    try {
      const payload = await this.batchService.create(createBatchDto);
      return handleApiResponse(
          'Batch created successfully',
          HttpStatus.CREATED,
          payload,
          null,
      );
    } catch (error) {
      console.error('Error creating batch:', error);
      return handleApiResponse(
          'Failed to create batch',
          HttpStatus.INTERNAL_SERVER_ERROR,
          null,
          error,
      );
    }
  }

  // Get all batches
  @Get()
  async findAll() {
    try {
      const payload = await this.batchService.findAll();
      return handleApiResponse(
          'Batches retrieved successfully',
          HttpStatus.OK,
          payload,
          null,
      );
    } catch (error) {
      console.error('Error fetching batches:', error);
      return handleApiResponse(
          'Failed to fetch batches',
          HttpStatus.INTERNAL_SERVER_ERROR,
          null,
          error,
      );
    }
  }

  // Get a single batch by ID
  @Get(':id')
  async findOne(@Param('id') id: number) {
    try {
      const payload = await this.batchService.findOne(id);
      return handleApiResponse(
          'Batch retrieved successfully',
          HttpStatus.OK,
          payload,
          null,
      );
    } catch (error) {
      console.error('Error fetching batch:', error);
      return handleApiResponse(
          'Failed to fetch batch',
          HttpStatus.INTERNAL_SERVER_ERROR,
          null,
          error,
      );
    }
  }

  // Update an existing batch
  @Put(':id')
  async update(
      @Param('id') id: number,
      @Body() updateBatchDto: UpdateBatchDto,
  ) {
    try {
      const payload = await this.batchService.update(id, updateBatchDto);
      return handleApiResponse(
          'Batch updated successfully',
          HttpStatus.OK,
          payload,
          null,
      );
    } catch (error) {
      console.error('Error updating batch:', error);
      return handleApiResponse(
          'Failed to update batch',
          HttpStatus.INTERNAL_SERVER_ERROR,
          null,
          error,
      );
    }
  }

  // Delete a batch
  @Delete(':id')
  async remove(@Param('id') id: number) {
    try {
      const isDeleted = await this.batchService.remove(id);
      return handleApiResponse(
          'Batch deleted successfully',
          HttpStatus.OK,
          isDeleted,
          null,
      );
    } catch (error) {
      console.error('Error deleting batch:', error);
      return handleApiResponse(
          'Failed to delete batch',
          HttpStatus.INTERNAL_SERVER_ERROR,
          null,
          error,
      );
    }
  }
}
