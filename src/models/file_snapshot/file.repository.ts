import { Model } from "mongoose";
import { AbstractRepository } from "../abstract.repository.js";
import { InjectModel } from "@nestjs/mongoose";
import { Injectable } from "@nestjs/common";
import { FileSnapshot } from "./file.schema.js";

@Injectable()
export class FileSnapshotRepository extends AbstractRepository<FileSnapshot> {
    constructor(@InjectModel(FileSnapshot.name) private readonly fileSnapshotModel:Model<FileSnapshot>) {
        super(fileSnapshotModel);
    }
}
