import { Types } from "mongoose";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose from "mongoose";


@Schema({
    timestamps: true,
    toJSON: {
        virtuals: true,
    },
    toObject: {
        virtuals: true,
    },
})

export class Token {
    private _id: string;

    @Prop({ type: mongoose.Types.ObjectId, ref: "User", required: true })
    userId: Types.ObjectId;

    @Prop({ type: String, required: true })
    token: string;

    @Prop({ type: Date, required: true })
    expires_at: Date;

}

export const TokenSchema = SchemaFactory.createForClass(Token);

// ✅ Index عشان البحث يكون سريع + الـ expired tokens تتحذف لوحدها
TokenSchema.index({ token: 1 });
TokenSchema.index({ expires_at: 1 }, { expireAfterSeconds: 0 }); // TTL index