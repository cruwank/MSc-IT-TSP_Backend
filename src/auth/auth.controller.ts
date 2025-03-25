import {Body, Controller, HttpStatus, Post} from '@nestjs/common';
import {AuthService} from './auth.service';
import {AuthDto} from "./auth.dto";
import {Public} from "./decorators/public.decorator";
import {handleApiResponse} from "../common/helpers/response.helper";

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @Public()
  async login(@Body() createUserDto: AuthDto) {
    try {
      let payload;
      const user = await this.authService.validateUser(
          createUserDto.username,
          createUserDto.password,
      );
      if (!user) {
        payload= 'Invalid credentials' ;
      }else {
        payload = this.authService.login(user);
      }

      return handleApiResponse(
          'Login successfully',
          !user?HttpStatus.BAD_REQUEST:HttpStatus.OK,
          payload,
          null,
      );
    } catch (error) {
      console.error('Error fetching student:', error);
      return handleApiResponse(
          'Failed to login',
          HttpStatus.INTERNAL_SERVER_ERROR,
          null,
          error,
      );
    }

  }
}
