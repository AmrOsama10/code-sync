import { Types } from "mongoose";

export class Room {
    _id: string;

    ownerId: Types.ObjectId;
    name: string;
    description: string;
    inviteCode: string;
    isPublic: boolean;
}
