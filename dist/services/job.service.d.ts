import { ObjectId } from "mongodb";
import { type JobListParams } from "../repositories/job.repository";
import type { JobDocument, UserDocument } from "../interfaces/models";
export declare class JobService {
    create(data: Omit<JobDocument, "_id" | "slug" | "createdBy" | "views" | "createdAt" | "updatedAt">, user: UserDocument): Promise<JobDocument>;
    list(params: JobListParams, viewer?: UserDocument): Promise<{
        data: {
            company: {
                _id: ObjectId | undefined;
                companyName: string;
                logo: string | undefined;
                location: string;
                industry: string;
                rating: number;
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
            salary: import("../types").SalaryRange;
            currency: string;
            experience: string;
            category: string;
            jobType: import("../types").JobType;
            workMode: import("../types").WorkMode;
            location: string;
            vacancies: number;
            applicationDeadline: Date;
            featured: boolean;
            status: import("../types").JobStatus;
            bannerImage?: string;
            views: number;
            createdAt: Date;
            updatedAt: Date;
        }[];
        meta: import("../types").PaginationMeta;
    }>;
    getByIdOrSlug(idOrSlug: string, viewer?: UserDocument): Promise<{
        company: import("../interfaces/models").CompanyDocument | null;
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
        salary: import("../types").SalaryRange;
        currency: string;
        experience: string;
        category: string;
        jobType: import("../types").JobType;
        workMode: import("../types").WorkMode;
        location: string;
        vacancies: number;
        applicationDeadline: Date;
        featured: boolean;
        status: import("../types").JobStatus;
        bannerImage?: string;
        views: number;
        createdAt: Date;
        updatedAt: Date;
    }>;
    update(id: string, updates: Partial<JobDocument>, user: UserDocument): Promise<JobDocument>;
    remove(id: string, user: UserDocument): Promise<{
        deleted: boolean;
    }>;
    uploadBanner(id: string, file: Express.Multer.File, user: UserDocument): Promise<JobDocument>;
    getFeatured(limit?: number): Promise<{
        data: {
            company: {
                _id: ObjectId | undefined;
                companyName: string;
                logo: string | undefined;
                location: string;
                industry: string;
                rating: number;
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
            salary: import("../types").SalaryRange;
            currency: string;
            experience: string;
            category: string;
            jobType: import("../types").JobType;
            workMode: import("../types").WorkMode;
            location: string;
            vacancies: number;
            applicationDeadline: Date;
            featured: boolean;
            status: import("../types").JobStatus;
            bannerImage?: string;
            views: number;
            createdAt: Date;
            updatedAt: Date;
        }[];
        meta: import("../types").PaginationMeta;
    }>;
    getMine(user: UserDocument, params: {
        page: number;
        limit: number;
        search?: string;
        status?: string;
        sort?: string;
    }): Promise<{
        data: {
            company: {
                _id: ObjectId | undefined;
                companyName: string;
                logo: string | undefined;
                location: string;
                industry: string;
                rating: number;
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
            salary: import("../types").SalaryRange;
            currency: string;
            experience: string;
            category: string;
            jobType: import("../types").JobType;
            workMode: import("../types").WorkMode;
            location: string;
            vacancies: number;
            applicationDeadline: Date;
            featured: boolean;
            status: import("../types").JobStatus;
            bannerImage?: string;
            views: number;
            createdAt: Date;
            updatedAt: Date;
        }[];
        meta: import("../types").PaginationMeta;
    }>;
    getCategories(): Promise<{
        name: string;
        count: number;
    }[]>;
}
export declare const jobService: JobService;
//# sourceMappingURL=job.service.d.ts.map