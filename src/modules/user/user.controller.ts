import { Auth, User } from '@common/decorator';
import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserService } from './user.service';

@Controller('user')
@Auth(['user', 'admin'])
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Post()
  create(@Body() createUserDto: any) {
    return this.userService.create(createUserDto);
  }

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get('/me')
  async findOne(@User() user: any) {
    console.log(user);
    const userData = await this.userService.findOne(user);
    return {
      success: true,
      message: 'User found successfully',
      data: userData
    };
  }

  @Patch('me/update')
  async update(@Body() updateUserDto: UpdateUserDto, @User() user: any) {
    const updatedUser = await this.userService.update(user.id, updateUserDto);
    return {
      success: true,
      message: 'User updated successfully',
      data: updatedUser
    };
  }

  @Post('send-otp')
  async sendOtp(@Body('email') email: string) {
    await this.userService.sendOtp(email);
    
    return {
      success: true,
      message: 'OTP sent successfully',
    };
  }

  @Patch('update-password')
  async updatePassword(
    @Body() updatePasswordDto: UpdatePasswordDto
  ) {
     await this.userService.updatePassword(updatePasswordDto);
  
    return {
      success: true,
      message: 'Password updated successfully',
    };
  }

  @Delete()
  async delete(@User() user: any){
     await this.userService.delete(user.id);
    return {
      success: true,
      message: 'User deleted successfully',
    };
  }
}

