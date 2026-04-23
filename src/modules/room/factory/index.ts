import mongoose from "mongoose";
import { CreateRoomDto } from "../dto/create-room.dto.js";
import { Room } from "../entities/room.entity.js";
import { generateInviteCode } from "@common/index";

export class RoomFactory {
 constructor() {
    
 }
 
 async createRoom(createRoomDto: CreateRoomDto,userId: string) {
    const room = new Room();
    room.name = createRoomDto.name;
    room.description = createRoomDto.description;
    room.inviteCode = await generateInviteCode();
    room.ownerId = new mongoose.Types.ObjectId(userId);
    room.isPublic = createRoomDto.isPublic;

    return room;
 }
}