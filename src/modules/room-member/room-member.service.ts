import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { Types } from 'mongoose';
import { RoomMemberRepository, RoomRepository } from '@models/index';

@Injectable()
export class RoomMemberService {
  constructor(
    private readonly roomMemberRepository: RoomMemberRepository,
    private readonly roomRepository: RoomRepository
  ) { }
  async getMember(roomId: string, userId: string) {
    const isMember = await this.roomMemberRepository.getOne({
      roomId: new Types.ObjectId(roomId),
      userId: new Types.ObjectId(userId)
    });

    if (!isMember) {
      throw new ForbiddenException('You are not a member of this room or room not found');
    }
    const member = await this.roomMemberRepository.getOne({ roomId: new Types.ObjectId(roomId), userId: new Types.ObjectId(userId) });

    return member;
  }
  async getAllMembers(roomId: string, userId: string) {
    const isMember = await this.roomMemberRepository.getOne({
      roomId: new Types.ObjectId(roomId),
      userId: new Types.ObjectId(userId)
    });

    if (!isMember) {
      throw new ForbiddenException('You are not a member of this room');
    }
    const members = await this.roomMemberRepository.getAll({ roomId: new Types.ObjectId(roomId) }, {}, {
      populate: {
        path: 'userId',
        select: 'userName email',
      },

    });

    return members;
  }

  async updateRole(roomId: string, loggedUserId: string, userId: string, role: string) {
    const room = await this.roomRepository.getOne({ _id: roomId });
    if (!room) {
      throw new NotFoundException('Room not found');
    }

    if (room.ownerId.toString() !== loggedUserId.toString()) {
      throw new ForbiddenException('Only the owner can update roles');
    }
    const member = await this.roomMemberRepository.getOne({ roomId: new Types.ObjectId(roomId), userId: new Types.ObjectId(userId) });
    if (!member) {
      throw new NotFoundException('Member not found in this room');
    }

    await this.roomMemberRepository.update({ roomId: new Types.ObjectId(roomId), userId: new Types.ObjectId(userId) }, { role });
    return true;
  }

  async removeMember(roomId: string, loggedUserId: string, userId: string) {
    const room = await this.roomRepository.getOne({ _id: roomId });
    if (!room) {
      throw new NotFoundException('Room not found');
    }

    if (room.ownerId.toString() !== loggedUserId.toString()) {
      throw new ForbiddenException('Only the owner can remove members');
    }

    const member = await this.roomMemberRepository.getOne({
      roomId: new Types.ObjectId(roomId),
      userId: new Types.ObjectId(userId),
    });
    if (!member) {
      throw new NotFoundException('Member not found in this room');
    }

    await this.roomMemberRepository.delete({
      roomId: new Types.ObjectId(roomId),
      userId: new Types.ObjectId(userId),
    });

    return true;
  }
}
