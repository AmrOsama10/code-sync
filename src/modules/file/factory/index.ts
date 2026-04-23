import { Types } from "mongoose";
import { CreateFileDto } from "../dto/create-file.dto";
import { File } from "../entities/file.entity";

export class FileFactory {
 create(createFileDto: CreateFileDto, userId: string, roomId: string) {
    const file = new File();
    file.name = createFileDto.name;
    file.language = createFileDto.language;
    file.content = createFileDto.content;
    file.last_edited_by = new Types.ObjectId(userId);
    file.roomId = new Types.ObjectId(roomId);
    return file;
 }   
}