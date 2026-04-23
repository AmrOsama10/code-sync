import { BadRequestException, ConflictException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { UpdateFileDto } from './dto/update-file.dto';
import { File } from './entities/file.entity';
import { FileRepository } from '@models/index';
import { Types } from 'mongoose';
import { RoomService } from '@modules/room/room.service';
import { RoomMemberService } from '@modules/room-member/room-member.service';
import { RoomMemberRole } from '@common/index';
import { FileSnapshotRepository } from '@models/file_snapshot/file.repository';

@Injectable()
export class FileService {
  constructor(
    private readonly fileRepository: FileRepository,
    private readonly roomMemberService: RoomMemberService,
    private readonly fileSnapshotRepository: FileSnapshotRepository,

  ) { }

  async create(file: File, userId: string, roomId: string) {
    const member = await this.roomMemberService.getMember(roomId, userId);

    if (member?.role !== RoomMemberRole.OWNER && member?.role !== RoomMemberRole.EDITOR) {
      throw new ForbiddenException('You are not the owner or editor of this room');
    }

    const existingFile = await this.fileRepository.getOne({ roomId: new Types.ObjectId(roomId), name: file.name });
    if (existingFile) {
      throw new ConflictException('File with this name already exists');
    }

    const newFile = await this.fileRepository.create(file);

    await this.fileSnapshotRepository.create({
      fileId: (newFile as any)._id as Types.ObjectId,
      content: file.content,
      editedBy: new Types.ObjectId(userId),
      operation: 'create'
    });

    return newFile;
  }

  async getAllFiles(roomId: string, userId: string) {
    const member = await this.roomMemberService.getMember(roomId, userId);
    if (!member) {
      throw new ForbiddenException('You are not a member of this room');
    }

    return await this.fileRepository.getAll({ roomId: new Types.ObjectId(roomId) });
  }

  async getFile(fileId: string, roomId: string, userId: string) {
    const member = await this.roomMemberService.getMember(roomId, userId);
    if (!member) {
      throw new ForbiddenException('You are not a member of this room');
    }

    const file = await this.fileRepository.getOne({ _id: fileId, roomId: new Types.ObjectId(roomId) });
    if (!file) {
      throw new NotFoundException('File not found');
    }

    return file;
  }

  async update(fileId: string, roomId: string, userId: string, updateFileDto: UpdateFileDto) {
    const member = await this.roomMemberService.getMember(roomId, userId);
    if (member?.role !== RoomMemberRole.OWNER && member?.role !== RoomMemberRole.EDITOR) {
      throw new ForbiddenException('Only owner or editor can update files');
    }

    const file = await this.fileRepository.getOne({ _id: fileId, roomId: new Types.ObjectId(roomId) });
    if (!file) {
      throw new NotFoundException('File not found');
    }

    if (updateFileDto.name && updateFileDto.name !== file.name) {
      const nameExists = await this.fileRepository.getOne({ name: updateFileDto.name, roomId: new Types.ObjectId(roomId) });
      if (nameExists) {
        throw new ConflictException('File with this name already exists');
      }
    }

    const updatedFile = await this.fileRepository.update(
      { _id: fileId, roomId: new Types.ObjectId(roomId) },
      {
        name: updateFileDto.name,
        language: updateFileDto.language,
        content: updateFileDto.content,
        lastEditedBy: new Types.ObjectId(userId),
      },
    );

    await this.fileSnapshotRepository.create({
      fileId: (updatedFile as any)._id as Types.ObjectId,
      content: updateFileDto.content,
      editedBy: new Types.ObjectId(userId),
      operation: 'update'
    });

    return updatedFile;
  }

  async remove(fileId: string, roomId: string, userId: string) {
    const member = await this.roomMemberService.getMember(roomId, userId);
    if (member?.role !== RoomMemberRole.OWNER) {
      throw new ForbiddenException('Only owner can delete files');
    }

    const file = await this.fileRepository.getOne({ _id: fileId, roomId: new Types.ObjectId(roomId) });
    if (!file) {
      throw new NotFoundException('File not found');
    }

    await this.fileRepository.delete({ _id: fileId });
    
    await this.fileSnapshotRepository.deleteAll({ fileId: new Types.ObjectId(fileId) });
    
    await this.fileSnapshotRepository.create({
      fileId: (file as any)._id as Types.ObjectId,
      content: file.content,
      editedBy: new Types.ObjectId(userId),
      operation: 'delete',
      deleted_at: new Date()
    });


    return { message: 'File deleted successfully' };
  }

  // Get file history
  

  async fileHistory(fileId: string, roomId: string, userId: string) {
    const member = await this.roomMemberService.getMember(roomId, userId);
    if (member?.role !== RoomMemberRole.OWNER && member?.role !== RoomMemberRole.EDITOR) {
      throw new ForbiddenException('Only owner or editor can view file history');
    }

    const file = await this.fileRepository.getOne({ _id: fileId, roomId: new Types.ObjectId(roomId) });
    if (!file) {
      throw new NotFoundException('File not found');
    }

    const snapshots = await this.fileSnapshotRepository.getAll({ fileId: new Types.ObjectId(fileId) });
    return snapshots;
  }

  async getSnapshot(snapshotId: string, fileId: string, roomId: string, userId: string) {
    const member = await this.roomMemberService.getMember(roomId, userId);
    if (member?.role !== RoomMemberRole.OWNER && member?.role !== RoomMemberRole.EDITOR) {
      throw new ForbiddenException('Only owner or editor can view file history');
    }

    const snapshot = await this.fileSnapshotRepository.getOne({ _id: snapshotId, fileId: new Types.ObjectId(fileId) });
    if (!snapshot) {
      throw new NotFoundException('Snapshot not found');
    }

    return snapshot;
  }

  async updateSnapshot(snapshotId: string, fileId: string, roomId: string, userId: string, updateFileDto: UpdateFileDto) {
    const member = await this.roomMemberService.getMember(roomId, userId);
    if (member?.role !== RoomMemberRole.OWNER && member?.role !== RoomMemberRole.EDITOR) {
      throw new ForbiddenException('Only owner or editor can update file history');
    }

    const snapshot = await this.fileSnapshotRepository.getOne({ _id: snapshotId, fileId: new Types.ObjectId(fileId) });
    if (!snapshot) {
      throw new NotFoundException('Snapshot not found');
    }

    if (snapshot.operation === 'delete') {
      throw new BadRequestException('Cannot update a deleted snapshot');
    }

    await this.fileSnapshotRepository.update({ _id: snapshotId }, updateFileDto);

    await this.fileRepository.update({ _id: fileId }, updateFileDto);

    return snapshot;
  }

  async resetFile(snapshotId: string, fileId: string, roomId: string, userId: string) {
    const member = await this.roomMemberService.getMember(roomId, userId);
    if (member?.role !== RoomMemberRole.OWNER) {
      throw new ForbiddenException('Only owner can reset file');
    }

    const snapshot = await this.fileSnapshotRepository.getOne(
      {
        _id: snapshotId,
        fileId: new Types.ObjectId(fileId),
        operation: 'delete'
      }
    );
    if (!snapshot) {
      throw new NotFoundException('Snapshot not found');
    }

    const resetFileData = {
      ...snapshot,
      _id: fileId,
      roomId: new Types.ObjectId(roomId),
      name: 'restored-file' + '-' + Date.now(),
      content: snapshot.content,
      last_edited_by: new Types.ObjectId(userId),
    };


    await this.fileRepository.create(resetFileData);
    await this.fileSnapshotRepository.deleteAll({ fileId: new Types.ObjectId(fileId) });

    return snapshot;
  }

}
