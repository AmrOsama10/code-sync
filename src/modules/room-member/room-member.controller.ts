import { Controller, Get, Patch, Param, Delete, Body } from '@nestjs/common';
import { RoomMemberService } from './room-member.service';
import { Auth, User } from '@common/decorator';
import { RoleMemberDto } from './dto/role-member.dto';

@Controller('room')
@Auth(['user', 'admin'])
export class RoomMemberController {
  constructor(private readonly roomMemberService: RoomMemberService) {}


  @Get('/:roomId/members')
  async getMembers(
    @Param('roomId') roomId: string,
    @User() user: any,
  ) {
    const members = await this.roomMemberService.getAllMembers(roomId, user._id);
    return {
      success: true,
      message: 'Members retrieved successfully',
      data: members
    };
  }
  

  @Patch('/:roomId/members/:userId/role')
  async updateRole(
    @Param('roomId') roomId: string,
    @Param('userId') userId: string,
    @Body() roleMemberDto: RoleMemberDto,
    @User() user: any,
  ) {
    const result = await this.roomMemberService.updateRole(roomId, user._id, userId, roleMemberDto.role);
    return {
      success: result,
      message: result ? 'Role updated successfully' : 'Failed to update role',
    };
  }

  @Delete('/:roomId/members/:userId/remove')
  async removeMember(
    @Param('roomId') roomId: string,
    @Param('userId') userId: string,
    @User() user: any,
  ) {
    const result = await this.roomMemberService.removeMember(roomId, user._id, userId);
    return {
      success: result,
      message: result ? 'Member removed successfully' : 'Failed to remove member',
    };
  }

}
