import { Auth } from '@common/decorator';
import { Body, Controller, Delete, Param, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { LoginDto } from './dto/login.dto';
import { AuthFactory } from './factory/index';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService, private readonly authFactory: AuthFactory) { }

  @Post('/register')
  async register(@Body() createAuthDto: CreateAuthDto) {
    const user = await this.authFactory.register(createAuthDto);
    const userCreated = await this.authService.register(user);
    return {
      success: true,
      message: 'User registered successfully',
      data: userCreated
    };
  }

  @Post('/login')
  async login(@Body() loginDto: LoginDto) {
    const tokens = await this.authService.login(loginDto);
    return {
      success: true,
      message: 'User logged in successfully',
      data: tokens
    };
  }

  @Post('refresh-token')
  async refreshToken(@Body('token') token: string) {
    const tokens = await this.authService.refreshToken(token);
    return {
      success: true,
      message: 'Token refreshed successfully',
      data: tokens
    };
  }



  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.authService.remove(+id);
  }
}

