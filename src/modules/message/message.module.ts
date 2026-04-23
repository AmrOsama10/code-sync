import { Module } from '@nestjs/common';
import { MessageService } from './message.service';
import { MessageController } from './message.controller';
import { RoomMemberModule } from '../room-member/room-member.module';
import { Message, MessageRepository, messageSchema,  } from '@models/index';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [MongooseModule.forFeature([{ name: Message.name, schema: messageSchema  }]),
    RoomMemberModule],
  controllers: [MessageController],
  providers: [MessageService,MessageRepository],
  exports: [MessageService,MessageRepository],
})
export class MessageModule {}
