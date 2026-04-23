import { FileSnapshotRepository } from "@models/file_snapshot/file.repository";
import { Injectable } from "@nestjs/common";
import { Cron } from "@nestjs/schedule";
import { Types } from "mongoose";

@Injectable()
export class CronService {
    constructor(
        private readonly fileSnapshotRepository: FileSnapshotRepository,
    ) { }

    @Cron('0 0 1 */3 *') 
    async deleteOldSnapshots() {
        
        const snapshots = await this.fileSnapshotRepository.getAll({
            deleted_at: { $ne: null },
        });

        if (!snapshots.length) return;

        const fileIds = [...new Set(snapshots.map((s) => s.fileId.toString()))].map(
            (id) => new Types.ObjectId(id),
        );

        await this.fileSnapshotRepository.deleteAll({
            fileId: { $in: fileIds },
        });
    }
}