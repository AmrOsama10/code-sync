import { Auth, User } from '@common/decorator';
import { Controller, Delete, Get, Param } from '@nestjs/common';
import { MessageService } from './message.service';

@Controller('rooms')
@Auth(['user'])
export class MessageController {
  constructor(private readonly messageService: MessageService) {}


  @Get('/:roomId/messages')
  async messagesHistory(@Param('roomId') roomId: string, @User() user: any) {
    const messages =  await this.messageService.getHistory(roomId);
    return { 
      success: true,
      message: 'Messages retrieved successfully',
      data: messages 
    };
  }


  @Delete(':roomId/message/:messageId')
  remove(@Param('roomId') roomId: string, @Param('messageId') messageId: string, @User() user: any) {
    return this.messageService.deleteMessage(messageId, user.id);
  }
}
