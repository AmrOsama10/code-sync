import {
  Room, RoomMember, RoomMemberRepository, roomMemberSchema,
  RoomRepository, roomSchema, User, UserRepository, userSchema
} from '@models/index';
import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { RoomMemberController } from './room-member.controller';
import { RoomMemberService } from './room-member.service';

@Module({
  imports: [MongooseModule.forFeature([
    { name: User.name, schema: userSchema },
    { name: Room.name, schema: roomSchema },
    { name: RoomMember.name, schema: roomMemberSchema }
  ])],
  controllers: [RoomMemberController],
  providers: [RoomMemberService, JwtService, UserRepository, RoomRepository, RoomMemberRepository],
  exports: [RoomMemberService, JwtService, UserRepository, RoomRepository, RoomMemberRepository],
})
export class RoomMemberModule { }
