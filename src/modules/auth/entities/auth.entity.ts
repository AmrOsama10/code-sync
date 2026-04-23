import { Types } from "mongoose";

export class Auth {
    _id: Types.ObjectId;
    userName: string;
    email: string;
    password: string;
    avatar: string;
}
