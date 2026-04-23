
import { Process, Processor } from '@nestjs/bull';
import type { Job } from 'bull';
import { CodeService } from './code.service.js';

@Processor('code-snapshot')
export class CodeSnapshotProcessor {
    constructor(private readonly codeService: CodeService) { }

    @Process('save-snapshot')
    async handleSaveSnapshot(
        job: Job<{ fileId: string; content: string; editedBy: string }>,
    ) {
        const { fileId, content, editedBy } = job.data;
        await this.codeService.saveSnapshot(fileId, content, editedBy);
    }
}