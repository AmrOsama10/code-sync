import { File, FileRepository, fileSchema, User, UserRepository, userSchema } from '@models/index';
import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { FileController } from './file.controller';
import { FileService } from './file.service';
import { FileFactory } from './factory/index.js';
import { RoomMemberModule } from '@modules/room-member/room-member.module';
import { FileSnapshotRepository } from '@models/file_snapshot/file.repository';
import { FileSnapshot, fileSnapshotSchema } from '@models/file_snapshot/file.schema';

@Module({
  imports: [MongooseModule.forFeature([
    { name: File.name, schema: fileSchema },
    { name: User.name, schema: userSchema },
    { name: FileSnapshot.name, schema: fileSnapshotSchema },
  ]), RoomMemberModule],
  controllers: [FileController],
  providers: [FileService, JwtService, UserRepository, FileRepository, FileFactory,FileSnapshotRepository],
  exports: [FileService, JwtService, UserRepository, FileRepository, FileFactory,FileSnapshotRepository],
})
export class FileModule { }
