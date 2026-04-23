import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { TokenRepository, User, UserRepository } from '@models/index';
import { compareData, hashingData } from '@common/index';
import { generateOtp, generateOtpExpiry } from '@common/helpers/otp';
import { sendEmail } from '@common/helpers/send-email';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly tokenRepository: TokenRepository,
  ) { }
  create(createUserDto) {
    return 'This action adds a new user';
  }

  findAll() {
    return `This action returns all user`;
  }

  async findOne(user: User) {
    const userExists = await this.userRepository.exists({ _id: user._id });
    if (!userExists) {
      throw new NotFoundException('User not found');
    }
    return userExists;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const updatedUser = await this.userRepository.update(
      { _id: id },
      { userName: updateUserDto?.username, email: updateUserDto?.email }
    );
    return updatedUser;
  }


  async sendOtp(email: string) {
    const user = await this.userRepository.getOne({ email });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const otp = generateOtp();
    const otpExpiry = generateOtpExpiry();

    await this.userRepository.update(
      { _id: user._id },
      { otp: await hashingData(otp), otpExpiry },
    );

      await sendEmail({
        from: 'CodeSync <no-reply@codesync.com>',
        to: email,
        subject: 'CodeSync — Your OTP',
        html: `<p>Your OTP is: <strong>${otp}</strong>. Valid for 10 minutes.</p>`,
      });

  }

  async updatePassword(updatePasswordDto: UpdatePasswordDto) {
    const user = await this.userRepository.getOne({ email: updatePasswordDto.email });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (!user.otp || !user.otpExpiry) {
      throw new BadRequestException('No OTP requested');
    }

    if (!(await compareData(updatePasswordDto.otp, user.otp))) {
      throw new BadRequestException('Invalid OTP');
    }

    if (user.otpExpiry < new Date()) {
      throw new BadRequestException('OTP expired');
    }

    const hashedPassword = await hashingData(updatePasswordDto.newPassword);

    await this.userRepository.update(
      { _id: user._id },
      { password: hashedPassword, otp: null, otpExpiry: null },
    );

    await this.tokenRepository.deleteAll({ userId: user._id });

  }
  
  async delete(id: string) {
   return await this.userRepository.delete({ _id: id });
    
  }
}
