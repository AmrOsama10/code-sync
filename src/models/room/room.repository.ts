import { Model } from "mongoose";
import { AbstractRepository } from "../abstract.repository.js";
import { Room } from "./room.schema.js";
import { InjectModel } from "@nestjs/mongoose";
import { Injectable } from "@nestjs/common";

@Injectable()
export class RoomRepository extends AbstractRepository<Room> {
    constructor(@InjectModel(Room.name) private readonly roomModel:Model<Room>) {
        super(roomModel);
    }
}
