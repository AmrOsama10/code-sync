import { Model } from "mongoose";
import { AbstractRepository } from "../abstract.repository.js";
import { InjectModel } from "@nestjs/mongoose";
import { Injectable } from "@nestjs/common";
import { File } from "./file.schema.js";

@Injectable()
export class FileRepository extends AbstractRepository<File> {
    constructor(@InjectModel(File.name) private readonly fileModel:Model<File>) {
        super(fileModel);
    }
}
