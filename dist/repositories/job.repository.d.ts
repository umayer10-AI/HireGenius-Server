import { ObjectId, type Filter } from "mongodb";
import { BaseRepository } from "./base.repository.js";
import type { JobDocument } from "../interfaces/models.js";
export interface JobListParams {
    page: number;
    limit: number;
    search?: string;
    category?: string;
    location?: string;
    experience?: string;
    jobType?: string;
    workMode?: string;
    companyId?: string;
    minSalary?: number;
    maxSalary?: number;
    featured?: boolean;
    status?: string;
    skills?: string;
    sort?: string;
    createdBy?: string;
}
export declare class JobRepository extends BaseRepository<JobDocument> {
    constructor();
    buildFilter(params: JobListParams): Filter<JobDocument>;
    getSort(sort?: string): Record<string, 1 | -1>;
    list(params: JobListParams): Promise<{
        data: JobDocument[];
        total: number;
    }>;
    findBySlug(slug: string): Promise<JobDocument | null>;
    incrementViews(id: ObjectId): Promise<void>;
    countByCompany(companyId: ObjectId, status?: string): Promise<number>;
}
export declare const jobRepository: JobRepository;
//# sourceMappingURL=job.repository.d.ts.map