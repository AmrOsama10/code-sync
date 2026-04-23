import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { UpdateRoomDto } from './dto/update-room.dto';
import { Room } from './entities/room.entity.js';
import { RoomMemberRepository, RoomRepository } from '@models/index';
import { Types } from 'mongoose';
import { generateInviteCode, RoomMemberRole } from '@common/index';

@Injectable()

export class RoomService {
  constructor(
    private readonly roomRepository: RoomRepository,
    private readonly roomMemberRepository: RoomMemberRepository
  ) { }
  async create(room: Room) {
    const existingRoom = await this.roomRepository.getOne({ name: room.name });
    if (existingRoom) {
      throw new ForbiddenException('Room name already exists');
    }

    const createdRoom = await this.roomRepository.create(room)

    await this.roomMemberRepository.create({
      roomId: (createdRoom as any)._id as Types.ObjectId,
      userId: room.ownerId,
      role: RoomMemberRole.OWNER,
    })
    return createdRoom;
  }

  async getRoomById(roomId: string, userId: string) {
    const room = await this.roomRepository.getOne({ _id: roomId });
    if (!room) {
      throw new NotFoundException('Room not found');
    }

    const isMember = await this.roomMemberRepository.getOne({
      roomId: room._id,
      userId,
    });
    if (!isMember) {
      throw new ForbiddenException('You are not a member of this room');
    }

    return room;
  }

  async updateRoom(roomId: string, userId: string, updateRoomDto: UpdateRoomDto) {
    await this.roomOwner(roomId, userId);

    if (updateRoomDto.name) {
      const existingRoom = await this.roomRepository.getOne({ name: updateRoomDto.name });
      if (existingRoom && existingRoom._id.toString() !== roomId) {
        throw new ForbiddenException('Room name already exists');
      }
    }

    const updatedRoom = await this.roomRepository.update(
      { _id: roomId },
      {
        name: updateRoomDto.name,
        description: updateRoomDto.description,
        isPublic: updateRoomDto.isPublic,
      },
    );

    return updatedRoom;
  }

  async remove(id: string, userId: string) {
    await this.roomOwner(id, userId);

    const deletedRoom = await this.roomRepository.delete({ _id: id });
    if (!deletedRoom) {
      throw new NotFoundException('Room not found');
    }

    await this.roomMemberRepository.delete({ roomId: new Types.ObjectId(id) });

    return true;
  }

  async joinRoom(roomId: string, userId: string, inviteCode?: string) {
    const room = await this.roomRepository.getOne({ _id: roomId });
    if (!room) {
      throw new NotFoundException('Room not found');
    }

    const isMember = await this.roomMemberRepository.getOne({
      roomId: room._id,
      userId,
    });
    if (isMember) {
      throw new ForbiddenException('You are already a member of this room');
    }

    if (inviteCode && inviteCode !== room.inviteCode) {
      throw new ForbiddenException('Invalid invite code');
    }

    await this.roomMemberRepository.create({
      roomId: new Types.ObjectId(room._id),
      userId: new Types.ObjectId(userId),
    });

    return room;
  }

  async leaveRoom(roomId: string, userId: string) {
    await this.roomOwner(roomId, userId);

    const isMember = await this.roomMemberRepository.getOne({
      roomId: roomId,
      userId,
    });
    if (!isMember) {
      throw new ForbiddenException('You are not a member of this room');
    }



    await this.roomMemberRepository.delete({
      roomId: new Types.ObjectId(roomId),
      userId: new Types.ObjectId(userId),
    });

    return true;
  }


  async generateInviteCode(roomId: string, userId: string) {
    await this.roomOwner(roomId, userId);

    const inviteCode = await generateInviteCode();
    await this.roomRepository.update({ _id: roomId }, { inviteCode });
    return inviteCode;
  }

  async roomOwner(roomId: string, userId: string) {
    const room = await this.roomRepository.getOne({ _id: roomId });
    if (!room) {
      throw new NotFoundException('Room not found');
    }
    if (room.ownerId.toString() !== userId.toString()) {
      throw new ForbiddenException('Only the owner can perform this action');
    }
    return room;
  }

}


