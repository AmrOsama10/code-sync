import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { Token, TokenRepository, TokenSchema, User, UserRepository, userSchema } from '@models/index';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [
   
    MongooseModule.forFeature([
      { name: User.name, schema: userSchema },
      { name: Token.name, schema: TokenSchema },
    ]),
  ],
  controllers: [UserController],
  providers: [UserService, UserRepository, JwtService, TokenRepository],
})
export class UserModule { }
