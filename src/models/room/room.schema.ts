import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Types } from "mongoose";

@Schema({
    timestamps: true,
    toJSON: {
        virtuals: true,
    },
    toObject: {
        virtuals: true,
    },
})
export class Room {
    readonly _id: string;

    @Prop({type: mongoose.Types.ObjectId, ref: 'User', required: true, trim: true})
    ownerId: Types.ObjectId;

    @Prop({type: String, trim: true})
    name: string;

    @Prop({type: String, required: true})
    description: string;
    
    @Prop({type: String, required: true, trim: true})
    inviteCode: string;

    @Prop({type: Boolean, default: true})
    isPublic: boolean;
}

export const roomSchema = SchemaFactory.createForClass(Room);