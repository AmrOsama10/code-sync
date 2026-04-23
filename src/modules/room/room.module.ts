import {
  Room, RoomMember, RoomMemberRepository, roomMemberSchema,
  RoomRepository, roomSchema, User, UserRepository, userSchema
} from '@models/index';
import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { RoomFactory } from './factory/index.js';
import { RoomController } from './room.controller';
import { RoomService } from './room.service';

@Module({
  imports: [MongooseModule.forFeature([
    { name: User.name, schema: userSchema },
    { name: Room.name, schema: roomSchema },
    { name: RoomMember.name, schema: roomMemberSchema }
  ])],
  controllers: [RoomController],
  providers: [RoomService, RoomFactory, JwtService, UserRepository, RoomRepository, RoomMemberRepository],
  exports: [RoomService, RoomFactory, JwtService, UserRepository, RoomRepository, RoomMemberRepository],
})
export class RoomModule { }
