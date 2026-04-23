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
export class Message {
    readonly _id: string;

    @Prop({type: mongoose.Types.ObjectId, ref: 'Room', required: true, trim: true})
    roomId: Types.ObjectId;
    
    @Prop({type: mongoose.Types.ObjectId, ref: 'User', required: true, trim: true})
    senderId: Types.ObjectId;

    // @Prop({type: mongoose.Types.ObjectId, ref: 'User', required: true, trim: true})
    // receiverId: Types.ObjectId;

    @Prop({type: String, required: true, trim: true})
    content: string;

  
}

export const messageSchema = SchemaFactory.createForClass(Message);