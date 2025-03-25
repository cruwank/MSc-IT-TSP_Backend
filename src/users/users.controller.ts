import {Controller, Get, Post, Body, Param, Delete, HttpStatus, Put} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {handleApiResponse} from "../common/helpers/response.helper";

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}


  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    try {
      const payload = await this.userService.create(createUserDto);
      return handleApiResponse(
          'User created successfully',
          HttpStatus.CREATED,
          payload,
          null,
      );
    } catch (error) {
      console.error('Error creating user:', error);
      return handleApiResponse(
          'Failed to create user',
          HttpStatus.INTERNAL_SERVER_ERROR,
          null,
          error,
      );
    }
  }

  @Get()
  async findAll() {
    try {
      const payload = await this.userService.findAll();
      return handleApiResponse(
          'Users retrieved successfully',
          HttpStatus.OK,
          payload,
          null,
      );
    } catch (error) {
      console.error('Error fetching users:', error);
      return handleApiResponse(
          'Failed to fetch users',
          HttpStatus.INTERNAL_SERVER_ERROR,
          null,
          error,
      );
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    try {
      const payload = await this.userService.findOne(id);
      return handleApiResponse(
          'User retrieved successfully',
          HttpStatus.OK,
          payload,
          null,
      );
    } catch (error) {
      console.error('Error fetching user:', error);
      return handleApiResponse(
          'Failed to fetch user',
          HttpStatus.INTERNAL_SERVER_ERROR,
          null,
          error,
      );
    }
  }

  @Put(':id')
  async update(@Param('id') id: number, @Body() updateUserDto: UpdateUserDto) {
    try {
      const payload = await this.userService.update(id, updateUserDto);
      return handleApiResponse(
          'User updated successfully',
          HttpStatus.OK,
          payload,
          null,
      );
    } catch (error) {
      console.error('Error updating user:', error);
      return handleApiResponse(
          'Failed to update user',
          HttpStatus.INTERNAL_SERVER_ERROR,
          null,
          error,
      );
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    try {
      const isDeleted = await this.userService.remove(id);
      return handleApiResponse(
          'User deleted successfully',
          HttpStatus.OK,
          isDeleted,
          null,
      );
    } catch (error) {
      console.error('Error deleting user:', error);
      return handleApiResponse(
          'Failed to delete user',
          HttpStatus.INTERNAL_SERVER_ERROR,
          null,
          error,
      );
    }
  }


}
