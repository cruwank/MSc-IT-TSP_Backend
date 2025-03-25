import {Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus} from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { CreateDashboardDto } from './dto/create-dashboard.dto';
import { UpdateDashboardDto } from './dto/update-dashboard.dto';
import {handleApiResponse} from "../common/helpers/response.helper";

@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Post('counts')
  async create(@Body() createDashboardDto: CreateDashboardDto) {

    try {
      const payload = await this.dashboardService.getTableCounts(createDashboardDto);
      return handleApiResponse(
          'Count retrieve successfully',
          HttpStatus.CREATED,
          payload,
          null,
      );
    } catch (error) {
      console.error('Error Count retrieve:', error);
      return handleApiResponse(
          'Failed to retrieve counts',
          HttpStatus.INTERNAL_SERVER_ERROR,
          null,
          error,
      );
    }
  }

}
