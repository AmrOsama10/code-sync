import { RoomMemberRole } from "@common/helpers/enum";
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
export class RoomMember {
    readonly _id: string;

    @Prop({type: mongoose.Types.ObjectId, ref: 'User', required: true, trim: true})
    userId: Types.ObjectId;

    @Prop({ type: mongoose.Types.ObjectId, ref: 'Room', trim: true })
    roomId: Types.ObjectId;

    @Prop({type: String,enum: RoomMemberRole ,default: RoomMemberRole.VIEWER})
    role: string;
    
    @Prop({type: Date, default: Date.now})
    joinedAt: Date;

    @Prop({type: Boolean, default: true})
    isActive: boolean;
}

export const roomMemberSchema = SchemaFactory.createForClass(RoomMember);