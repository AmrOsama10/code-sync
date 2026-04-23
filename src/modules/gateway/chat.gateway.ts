// chat.gateway.ts
import { CodeService } from '@modules/code/code.service';
import { MessageService } from '@modules/message/message.service';
import { InjectRedis } from '@nestjs-modules/ioredis';
import { InjectQueue } from '@nestjs/bull';
import {
    ConnectedSocket,
    MessageBody,
    OnGatewayConnection,
    OnGatewayDisconnect,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
} from '@nestjs/websockets';
import type { Queue } from 'bull';
import Redis from 'ioredis';
import { Types } from 'mongoose';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
    cors: { origin: '*' },
    namespace: 'chat',
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server: Server;

    constructor(
        private readonly messageService: MessageService,
        private readonly codeService: CodeService,
        @InjectQueue('code-snapshot') private readonly snapshotQueue: Queue,
        @InjectRedis() private readonly redis: Redis
    ) { }

    async handleConnection(client: Socket) {
        const user = await this.messageService.authenticateSocket(client);
        if (!user) {
            client.disconnect();
            return;
        }
        client.data.user = user;
    }

    handleDisconnect(client: Socket) {
        client.rooms.forEach((roomId) => {
            if (roomId !== client.id) {
                client.to(roomId).emit('user_left', {
                    userId: client.data.user?._id,
                    username: client.data.user?.username,
                });
            }
        });
    }

    @SubscribeMessage('join_room')
    async handleJoinRoom(
        @ConnectedSocket() client: Socket,
        @MessageBody() payload: { roomId: string },
    ) {
        
        if (!payload.roomId) {
            client.emit('error', { message: 'Invalid room data' });
            return;
        }
        const user = client.data.user;

        const isMember = await this.messageService.validateMember(
            payload.roomId,
            user._id,
        );
        if (!isMember) {
            client.emit('error', { message: 'You are not a member of this room' });
            return;
        }

        const history = await this.messageService.getHistory(payload.roomId);

        client.join(payload.roomId);

        client.emit('room_history', history);

        client.to(payload.roomId).emit('user_joined', {
            userId: user._id,
            username: user.userName,
        });
        
    }

    @SubscribeMessage('leave_room')
    async handleLeaveRoom(
        @ConnectedSocket() client: Socket,
        @MessageBody() payload: { roomId: string },
    ) {
        
        if (!payload.roomId) {
            client.emit('error', { message: 'Invalid room data' });
            return;
        }
        client.leave(payload.roomId);
        client.to(payload.roomId).emit('user_left', {
            userId: client.data.user?._id,
            username: client.data.user?.username,
        });
    }

    @SubscribeMessage('send_message')
    async handleMessage(
        @ConnectedSocket() client: Socket,
        @MessageBody() payload: { roomId: string; content: string },
    ) {

        if (!payload.roomId || !payload.content) {
            client.emit('error', { message: 'Invalid message data' });
            return;
        }
        const user = client.data.user;

        const rooms = Array.from(client.rooms);
  
        
        if (!rooms.includes(payload.roomId)) {
            client.emit('error', { message: 'Join the room first' });
            return;
        }

        const savedMessage = await this.messageService.saveMessage({
            roomId: new Types.ObjectId(payload.roomId),
            senderId: user._id,
            content: payload.content,
        });

        this.server.to(payload.roomId).emit('new_message', savedMessage);
    }

    @SubscribeMessage('code_change')
    async handleCodeChange(
        @ConnectedSocket() client: Socket,
        @MessageBody()
        payload: {
            roomId: string;
            fileId: string;
            content: string;
            cursorPosition: number;
        },
    ) {
        const user = client.data.user;

        const canEdit = await this.codeService.validateEditorCode(
            payload.roomId,
            user._id,
        );
        if (!canEdit) {
            client.emit('error', { message: 'You are not allowed to edit' });
            return;
        }

        client.to(payload.roomId).emit('code_updated', {
            fileId: payload.fileId,
            content: payload.content,
            cursorPosition: payload.cursorPosition,
            editedBy: {
                userId: user._id,
                username: user.username,
            },
        });

        const redisKey = `file:${payload.fileId}:content`;
        await this.redis.set(redisKey, payload.content);

        await this.snapshotQueue.add(
            'save-snapshot',
            {
                fileId: payload.fileId,
                content: payload.content,
                editedBy: user._id,
            },
            {
                delay: 10000,
                jobId: `snapshot-${payload.fileId}`,
                removeOnComplete: true,
            },
        );
    }

    @SubscribeMessage('cursor_move')
    async handleCursorMove(
        @ConnectedSocket() client: Socket,
        @MessageBody()
        payload: {
            roomId: string;
            fileId: string;
            line: number;
            column: number;
        },
    ) {
        const user = client.data.user;

        client.to(payload.roomId).emit('cursor_updated', {
            fileId: payload.fileId,
            line: payload.line,
            column: payload.column,
            user: {
                userId: user._id,
                username: user.userName,
            },
        });
    }

    @SubscribeMessage('request_file_content')
    async handleRequestFileContent(
        @ConnectedSocket() client: Socket,
        @MessageBody() payload: { roomId: string; fileId: string },
    ) {
        const user = client.data.user;

        const isMember = await this.messageService.validateMember(
            payload.roomId,
            user._id,
        );
        if (!isMember) {
            client.emit('error', { message: 'You are not a member of this room' });
            return;
        }

        const redisKey = `file:${payload.fileId}:content`;
        const cached = await this.redis.get(redisKey);

        if (cached) {
            client.emit('file_content', { fileId: payload.fileId, content: cached });
            return;
        }

        const content = await this.codeService.getFileContent(payload.fileId);
        
        client.emit('file_content', { fileId: payload.fileId, content });
    }
}