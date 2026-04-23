import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { User, UserRepository } from '@models/index';
import { Auth } from './entities/auth.entity';
import { compareData } from '@common/index';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { TokenRepository } from '@models/index';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly tokenRepository: TokenRepository,
  ) { }
  async register(user: Auth) {
    const userExists = await this.userRepository.exists({ email: user.email });
    if (userExists) {
      throw new BadRequestException('User already exists');
    }

    const createdUser = await this.userRepository.create(user);
    (createdUser as any).password = undefined;
    return createdUser;
  }

  async login(loginDto: LoginDto) {
    const userExists = await this.userRepository.exists({ email: loginDto.email });
    if (!userExists) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const matchedPassword = await compareData(loginDto.password, userExists.password);
    if (!matchedPassword) {
      throw new UnauthorizedException('Invalid credentials');
    }


    return await this.generateTokens(userExists);
  }

  private async generateTokens(user: User) {
    const payload = { id: user._id, email: user.email };

    const accessToken = await this.jwtService.signAsync(payload, {
      expiresIn: '1h',
      secret: this.configService.get('jwt').accessSecret,
    });

    const refreshToken = await this.jwtService.signAsync(payload, {
      expiresIn: '7d',
      secret: this.configService.get('jwt').refreshSecret,
    });

    await this.tokenRepository.create({
      userId: user._id,
      token: refreshToken,
      expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      
    });

    return {
      accessToken,
      refreshToken
    };
  }

  async refreshToken(token: string) {
    const storedToken = await this.tokenRepository.getOne({ token, expires_at: { $gte: new Date() } });
    if (!storedToken) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const payload = await this.jwtService.verifyAsync<{ id: string; email: string }>(token, {
      secret: this.configService.get('jwt').refreshSecret,
    });

    const user = await this.userRepository.getOne({ _id: payload.id });
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    await this.tokenRepository.delete({ token });

    return await this.generateTokens(user);
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }
}
