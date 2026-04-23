import { RoomMemberRole } from "@common/index";
import { FileSnapshotRepository } from "@models/file_snapshot/file.repository";
import { FileRepository, RoomMemberRepository } from "@models/index";
import { Injectable, NotFoundException } from "@nestjs/common";
import { Types } from "mongoose";

@Injectable()
export class CodeService {
    constructor(
        private readonly roomMemberRepository: RoomMemberRepository,
        private readonly fileRepository: FileRepository,
        private readonly fileSnapshotRepository: FileSnapshotRepository,
    ) { }
    async validateEditorCode(roomId: string, userId: string) {
        const member = await this.roomMemberRepository.getOne({ roomId: new Types.ObjectId(roomId), userId: new Types.ObjectId(userId) });
        return (
            member?.role === RoomMemberRole.OWNER ||
            member?.role === RoomMemberRole.EDITOR
        );
    }

    async getFileContent(fileId: string) {
        const file = await this.fileRepository.getOne({ _id: fileId });
        if (!file) {
            throw new NotFoundException('File not found');
        }
        return file.content;
    }

    async saveSnapshot(fileId: string, content: string, editedBy: string) {
 
        await this.fileRepository.update(
            { _id: fileId },
            { content, lastEditedBy: new Types.ObjectId(editedBy) },
        );

       
        await this.fileSnapshotRepository.create({
            fileId: new Types.ObjectId(fileId),
            content,
            editedBy: new Types.ObjectId(editedBy),
            operation: 'update',
        });
    }
}



