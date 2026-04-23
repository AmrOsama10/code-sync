import { MessageRepository, RoomMemberRepository, UserRepository } from "@models/index";
import { ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { Types } from "mongoose";
import { Socket } from "socket.io";


@Injectable()
export class MessageService {
  constructor(
    private readonly messageRepository: MessageRepository,
    private readonly roomMemberRepository: RoomMemberRepository,
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) { }

  async authenticateSocket(client: Socket) {
    const token = client.handshake.headers?.authorization;

    if (!token) return null;

    try {
      const payload = await this.jwtService.verifyAsync<{ id: string }>(token, {
        secret: this.configService.get('jwt').accessSecret,
      });
      return await this.userRepository.getOne({ _id: payload.id });
    } catch (e) {
      console.log(e);
      
      return null;
    }
  }

  async validateMember(roomId: string, userId: string) {
    return await this.roomMemberRepository.getOne({ roomId: new Types.ObjectId(roomId), userId });
  }

  async saveMessage(data: { roomId: Types.ObjectId; senderId: Types.ObjectId; content: string }) {
    const message = await this.messageRepository.create(data);

    
    return await this.messageRepository.getOne({ _id: (message as any)._id.toString() }, undefined, {
      populate: { path: 'senderId', select: 'userName ' },
    });
  }

  async getHistory(roomId: string) {
    return await this.messageRepository.getAll(
      { roomId: new Types.ObjectId(roomId) },{},
      
      {
        populate: [
          {
            path: 'senderId',
            select: 'userName ',
          },
        ],
        sort: { createdAt: 1 },
        limit: 50, 
      },
    );
  }

  async deleteMessage(messageId: string, userId: string) {
    const message = await this.messageRepository.getOne({ _id: messageId });
    if (!message) throw new NotFoundException('Message not found');

    if (message.senderId.toString() !== userId) {
      throw new ForbiddenException('You can only delete your own messages');
    }

    await this.messageRepository.delete({ _id: messageId });
    return { messageId };
  }
}