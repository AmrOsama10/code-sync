import {
    FileRepository, fileSchema, FileSnapshot, FileSnapshotRepository,
    fileSnapshotSchema, RoomMember, RoomMemberRepository, roomMemberSchema,
    User,
    UserRepository,
    userSchema
} from "@models/index";
import { MessageModule } from "@modules/message/message.module";
import { MessageService } from "@modules/message/message.service";
import { BullModule } from "@nestjs/bull";
import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { JwtModule } from "@shared/jwt.module";
import { CodeSnapshotProcessor } from "./code-snapshot.processor";
import { CodeService } from "./code.service";

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: RoomMember.name, schema: roomMemberSchema },
            { name: File.name, schema: fileSchema },
            { name: FileSnapshot.name, schema: fileSnapshotSchema },
            { name: User.name, schema: userSchema }
        ]),
        BullModule.registerQueue({ name: 'code-snapshot' }),
        MessageModule,
        JwtModule,

    ],
    providers: [CodeService, RoomMemberRepository, FileRepository, FileSnapshotRepository,
         CodeSnapshotProcessor,MessageService,UserRepository],
    exports: [CodeService],
})
export class CodeModule { }