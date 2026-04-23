import { Model } from "mongoose";
import { AbstractRepository } from "../abstract.repository.js";
import { InjectModel } from "@nestjs/mongoose";
import { Injectable } from "@nestjs/common";
import { RoomMember } from "./room-member.schema.js";

@Injectable()
export class RoomMemberRepository extends AbstractRepository<RoomMember> {
    constructor(@InjectModel(RoomMember.name) private readonly roomMemberModel:Model<RoomMember>) {
        super(roomMemberModel);
    }
}
