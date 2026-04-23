import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { AuthFactory } from './factory/index';
import { Token, TokenSchema, User, UserRepository, userSchema } from '@models/index';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { TokenRepository } from '@models/index';

@Module({
  imports: [MongooseModule.forFeature([
    { name: User.name, schema: userSchema },
    { name: Token.name, schema: TokenSchema }
  ])],
  controllers: [AuthController],
  providers: [AuthService, AuthFactory, UserRepository, JwtService, TokenRepository],
})
export class AuthModule { }
