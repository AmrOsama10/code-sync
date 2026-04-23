import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { RoomService } from './room.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { RoomFactory } from './factory/index.js';
import { Auth, User } from '@common/decorator';

@Controller('room')
@Auth(['user','admin'])
export class RoomController {
  constructor(
    private readonly roomService: RoomService,
    private readonly roomFactory: RoomFactory,
  ) {}

  @Post('/create')
  async create(@Body() createRoomDto: CreateRoomDto,@User() user: any) {
    const room = await this.roomFactory.createRoom(createRoomDto, user._id);
    const createdRoom = await this.roomService.create(room);
    
    return {
      success: true,
      message: 'Room created successfully',
      data: createdRoom
    };
  }

  @Get('/:id')
  async getRoomById(
    @Param('id') roomId: string,
    @User() user: any,
  ) {
    return this.roomService.getRoomById(roomId, user._id);
  }

  @Patch(':id')
  async updateRoom(
    @Param('id') roomId: string,
    @Body() updateRoomDto: UpdateRoomDto,
    @User() user: any,
  ) {
    return this.roomService.updateRoom(roomId, user._id, updateRoomDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string , @User() user: any) {
    const result = await this.roomService.remove(id, user._id);
    return {
      success: result,
      message: result ? 'Room deleted successfully' : 'Failed to delete room',
    };
  }

  @Post('/:id/join')
  async joinRoom(
    @Param('id') id: string,
    @Body('inviteCode') inviteCode: string,
    @User() user: any,
  ) {
    const room = await this.roomService.joinRoom(id, user._id, inviteCode);
    return {
      success: true,
      message: 'Room joined successfully',
      data: room
    };
  }

  @Post('/:id/leave')
  async leaveRoom(
    @Param('id') id: string,
    @User() user: any,
  ) {
    const result = await this.roomService.leaveRoom(id, user._id);
    return {
      success: result,
      message: result ? 'Room left successfully' : 'Failed to leave room',
    };
  }


  @Post('/:id/generate-invite-code')
  async generateInviteCode(
    @Param('id') id: string,
    @User() user: any,
  ) {
    const inviteCode = await this.roomService.generateInviteCode(id, user._id);
    return {
      success: true,
      message: 'Invite code generated successfully',
      data: inviteCode
    };
  }



}
