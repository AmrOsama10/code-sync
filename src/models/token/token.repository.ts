import { AbstractRepository } from "@models/abstract.repository";
import { Token } from "./token.schema";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Injectable } from "@nestjs/common";

@Injectable()
export class TokenRepository extends AbstractRepository<Token> {
    constructor(@InjectModel(Token.name) private readonly tokenModel: Model<Token>) {
        super(tokenModel);
    }
}
