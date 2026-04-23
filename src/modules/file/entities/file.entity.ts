import { Types } from "mongoose";

export class File {
    _id: string;

    roomId: Types.ObjectId;
    name: string;
    language: string;
    content: string;
    last_edited_by: Types.ObjectId;
}
