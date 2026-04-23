import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { FileService } from './file.service';
import { CreateFileDto } from './dto/create-file.dto';
import { UpdateFileDto } from './dto/update-file.dto';
import { Auth, User } from '@common/decorator';
import { FileFactory } from './factory/index.js';

@Controller('room')
@Auth(['user', 'admin'])
export class FileController {
  constructor(private readonly fileService: FileService,
    private readonly fileFactory: FileFactory
  ) {}

  @Post('/:roomId/files')
  async create(@Body() createFileDto: CreateFileDto,@User() user: any, @Param('roomId') roomId: string) {
    const file = this.fileFactory.create(createFileDto,user,roomId);
    const createdFile = await this.fileService.create(file,user._id,roomId);
    return {
      success: true,
      message: 'File created successfully',
      data: createdFile
    };
  }

  @Get('/:roomId/files')
  async getAllFiles(
    @Param('roomId') roomId: string,
    @User() user: any,
  ) {
    const files = await this.fileService.getAllFiles(roomId, user._id);
    return {
      success: true,
      message: 'Files retrieved successfully',
      data: files
    };
  }

  @Get('/:roomId/file/:fileId')
  async getFile(
    @Param('roomId') roomId: string,
    @Param('fileId') fileId: string,
    @User() user: any,
  ) {
    const file = await this.fileService.getFile(fileId, roomId, user._id);
    return {
      success: true,
      message: 'File retrieved successfully',
      data: file
    };
  }

  @Patch('/:roomId/file/:fileId')
  async update(
    @Param('roomId') roomId: string,
    @Param('fileId') fileId: string,
    @Body() updateFileDto: UpdateFileDto,
    @User() user: any,
  ) {
    const file = await this.fileService.update(fileId, roomId, user._id, updateFileDto);
    return {
      success: true,
      message: 'File updated successfully',
      data: file
    };
  }

  @Delete('/:roomId/file/:fileId')
  async remove(
    @Param('roomId') roomId: string,
    @Param('fileId') fileId: string,
    @User() user: any,
  ) {
    await this.fileService.remove(fileId, roomId, user._id);
    return {
      success: true,
      message: 'File deleted successfully'
    };
  }

  @Get('/:roomId/file/:fileId/history')
  async fileHistory(
    @Param('roomId') roomId: string,
    @Param('fileId') fileId: string,
    @User() user: any,
  ) {
    const history = await this.fileService.fileHistory(fileId, roomId, user._id);
    return {
      success: true,
      message: 'File history retrieved successfully',
      data: history
    };
  }

  @Get('/:roomId/file/:fileId/snapshot/:snapshotId')
  async getSnapshot(
    @Param('roomId') roomId: string,
    @Param('fileId') fileId: string,
    @Param('snapshotId') snapshotId: string,
    @User() user: any,
  ) {
    const snapshot = await this.fileService.getSnapshot(snapshotId, fileId, roomId, user._id);
    return {
      success: true,
      message: 'Snapshot retrieved successfully',
      data: snapshot
    };
  }
  
  @Patch('/:roomId/file/:fileId/snapshot/:snapshotId')
  async updateSnapshot(
    @Param('roomId') roomId: string,
    @Param('fileId') fileId: string,
    @Param('snapshotId') snapshotId: string,
    @Body() updateFileDto: UpdateFileDto,
    @User() user: any,
  ) {
    const snapshot = await this.fileService.updateSnapshot(snapshotId, fileId, roomId, user._id, updateFileDto);
    return {
      success: true,
      message: 'Snapshot updated successfully',
      data: snapshot
    };
  }
  
  @Post('/:roomId/file/:fileId/snapshot/:snapshotId/reset')
  async resetFile(
    @Param('roomId') roomId: string,
    @Param('fileId') fileId: string,
    @Param('snapshotId') snapshotId: string,
    @User() user: any,
  ) {
    const snapshot = await this.fileService.resetFile(snapshotId, fileId, roomId, user._id);
    return {
      success: true,
      message: 'File reset successfully',
      data: snapshot
    };
  }
}
