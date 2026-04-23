import { ConfigModule } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { Module } from "@nestjs/common";
import { ChatGateway } from "./chat.gateway";
import { WsGuard } from "@common/guard/ws.guard";
import { MessageModule } from "@modules/message/message.module";
import {
    FileRepository, fileSchema, FileSnapshot, FileSnapshotRepository,
    fileSnapshotSchema, RoomMember, RoomMemberRepository, roomMemberSchema, User, UserRepository, userSchema
} from "@models/index";
import { MongooseModule } from "@nestjs/mongoose";
import { CodeService } from "@modules/code/code.service";
import { MessageService } from "@modules/message/message.service";
import { BullModule } from "@nestjs/bull";
import { RedisModule } from "@nestjs-modules/ioredis";

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: User.name, schema: userSchema },
            { name: RoomMember.name, schema: roomMemberSchema },
            { name: File.name, schema: fileSchema },
            { name: FileSnapshot.name, schema: fileSnapshotSchema }
        ]),
        BullModule.registerQueue({
            name: 'code-snapshot',
        }),
        RedisModule,
        JwtModule,
        ConfigModule,
        MessageModule,
    ],
    providers: [ChatGateway, WsGuard, UserRepository, CodeService, RoomMemberRepository,
        FileRepository, FileSnapshotRepository],
})
export class GatewayModule { }