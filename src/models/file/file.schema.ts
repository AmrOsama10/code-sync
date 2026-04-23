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
export class File {
    readonly _id: string;

    @Prop({type: mongoose.Types.ObjectId, ref: 'Room', required: true, trim: true})
    roomId: Types.ObjectId;

    @Prop({type: String, required: true, trim: true})
    name: string;

    @Prop({type: String})
    language: string;
    
    @Prop({type: String, required: true, trim: true})
    content: string;

    @Prop({type: mongoose.Types.ObjectId, ref: 'User', required: true, trim: true})
    last_edited_by: Types.ObjectId;

  
}

export const fileSchema = SchemaFactory.createForClass(File);