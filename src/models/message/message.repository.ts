import { Model } from "mongoose";
import { AbstractRepository } from "../abstract.repository.js";
import { InjectModel } from "@nestjs/mongoose";
import { Injectable } from "@nestjs/common";
import { Message } from "./message.schema.js";

@Injectable()
export class MessageRepository extends AbstractRepository<Message> {
    constructor(@InjectModel(Message.name) private readonly messageModel:Model<Message>) {
        super(messageModel);
    }
}
