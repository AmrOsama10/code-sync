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
export class FileSnapshot {
    readonly _id: string;

    @Prop({ type: mongoose.Types.ObjectId, ref: 'File', required: true, trim: true })
    fileId: Types.ObjectId;

    @Prop({ type: mongoose.Types.ObjectId, ref: 'User', required: true, trim: true })
    editedBy: Types.ObjectId;

    @Prop({ type: String, trim: true })
    operation: string;

    @Prop({ type: String, required: true, trim: true })
    content: string;

    @Prop({ type: Date, default: null })
    deleted_at: Date;
}

export const fileSnapshotSchema = SchemaFactory.createForClass(FileSnapshot);