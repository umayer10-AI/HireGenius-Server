import type { ApplicationDocument, UserDocument } from "../interfaces/models.js";
import type { ApplicationStatus } from "../types/index.js";
export declare class ApplicationService {
    apply(input: {
        jobId: string;
        coverLetter?: string;
        expectedSalary?: number;
        portfolio?: string;
        github?: string;
        linkedin?: string;
        resume?: string;
    }, candidate: UserDocument, resumeFile?: Express.Multer.File): Promise<ApplicationDocument>;
    list(params: {
        page: number;
        limit: number;
        status?: string;
        jobId?: string;
        candidateId?: string;
        sort?: string;
    }, requester: UserDocument): Promise<{
        data: {
            job: {
                _id: import("bson").ObjectId | undefined;
                title: string;
                slug: string;
                location: string;
                companyName: string | undefined;
                companyLogo: string | undefined;
            } | null;
            candidate: {
                _id: import("bson").ObjectId | undefined;
                name: string;
                email: string;
                image: string | undefined;
                skills: string[];
                resume: string | undefined;
            } | null;
            _id?: import("bson").ObjectId;
            jobId: import("bson").ObjectId;
            candidateId: import("bson").ObjectId;
            resume: string;
            coverLetter?: string;
            expectedSalary?: number;
            portfolio?: string;
            github?: string;
            linkedin?: string;
            status: ApplicationStatus;
            notes?: string;
            createdAt: Date;
            updatedAt: Date;
        }[];
        meta: import("../types/index.js").PaginationMeta;
    }>;
    private enrich;
    getById(id: string, requester: UserDocument): Promise<{
        job: {
            _id: import("bson").ObjectId | undefined;
            title: string;
            slug: string;
            location: string;
            companyName: string | undefined;
            companyLogo: string | undefined;
        } | null;
        candidate: {
            _id: import("bson").ObjectId | undefined;
            name: string;
            email: string;
            image: string | undefined;
            skills: string[];
            resume: string | undefined;
        } | null;
        _id?: import("bson").ObjectId;
        jobId: import("bson").ObjectId;
        candidateId: import("bson").ObjectId;
        resume: string;
        coverLetter?: string;
        expectedSalary?: number;
        portfolio?: string;
        github?: string;
        linkedin?: string;
        status: ApplicationStatus;
        notes?: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    updateStatus(id: string, updates: {
        status?: ApplicationStatus;
        notes?: string;
    }, requester: UserDocument): Promise<ApplicationDocument>;
    remove(id: string, requester: UserDocument): Promise<{
        deleted: boolean;
    }>;
}
export declare const applicationService: ApplicationService;
//# sourceMappingURL=application.service.d.ts.map