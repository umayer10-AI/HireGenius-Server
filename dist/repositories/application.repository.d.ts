import { ObjectId } from "mongodb";
import { BaseRepository } from "./base.repository";
import type { ApplicationDocument } from "../interfaces/models";
export declare class ApplicationRepository extends BaseRepository<ApplicationDocument> {
    constructor();
    list(params: {
        page: number;
        limit: number;
        search?: string;
        status?: string;
        jobId?: string;
        candidateId?: string;
        sort?: string;
    }): Promise<{
        data: ApplicationDocument[];
        total: number;
    }>;
    findExisting(jobId: ObjectId, candidateId: ObjectId): Promise<ApplicationDocument | null>;
    countByJob(jobId: ObjectId): Promise<number>;
    countByCandidate(candidateId: ObjectId): Promise<number>;
}
export declare const applicationRepository: ApplicationRepository;
//# sourceMappingURL=application.repository.d.ts.map