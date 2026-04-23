import { UserRole } from "@common/index";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Types } from "mongoose";

@Schema({
    timestamps: true,
    toJSON: {
        virtuals: true,
    },
    toObject: {
        virtuals: true,
    },
})
export class User {
    readonly _id: Types.ObjectId;

    @Prop({ type: String, required: true, trim: true })
    userName: string;

    @Prop({ type: String, required: true, unique: true, trim: true })
    email: string;

    @Prop({ type: String, required: true })
    password: string;

    @Prop({ type: String })
    avatar: string;

    @Prop({ type: String, enum: UserRole, default: UserRole.USER })
    role: string;

    @Prop({ type: String })
    otp: string

    @Prop({ type: Date })
    otpExpiry: Date
}

export const userSchema = SchemaFactory.createForClass(User);