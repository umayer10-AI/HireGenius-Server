import { ObjectId } from "mongodb";
import type { UserDocument } from "../interfaces/models.js";
export declare class SavedJobService {
    save(jobId: string, user: UserDocument): Promise<import("../interfaces/models.js").SavedJobDocument>;
    list(user: UserDocument, page: number, limit: number): Promise<{
        data: {
            job: {
                company: {
                    _id: ObjectId | undefined;
                    companyName: string;
                    logo: string | undefined;
                } | null;
                _id?: ObjectId;
                companyId: ObjectId;
                createdBy: ObjectId;
                title: string;
                slug: string;
                shortDescription: string;
                description: string;
                requirements: string[];
                responsibilities: string[];
                benefits: string[];
                skills: string[];
                salary: import("../types/index.js").SalaryRange;
                currency: string;
                experience: string;
                category: string;
                jobType: import("../types/index.js").JobType;
                workMode: import("../types/index.js").WorkMode;
                location: string;
                vacancies: number;
                applicationDeadline: Date;
                featured: boolean;
                status: import("../types/index.js").JobStatus;
                bannerImage?: string;
                views: number;
                createdAt: Date;
                updatedAt: Date;
            } | null;
            _id?: ObjectId;
            userId: ObjectId;
            jobId: ObjectId;
            createdAt: Date;
            updatedAt: Date;
        }[];
        meta: import("../types/index.js").PaginationMeta;
    }>;
    remove(idOrJobId: string, user: UserDocument): Promise<{
        deleted: boolean;
    }>;
}
export declare const savedJobService: SavedJobService;
//# sourceMappingURL=saved-job.service.d.ts.map