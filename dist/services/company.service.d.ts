import { ObjectId } from "mongodb";
import type { CompanyDocument, UserDocument } from "../interfaces/models.js";
export declare class CompanyService {
    create(data: Omit<CompanyDocument, "_id" | "ownerId" | "verified" | "rating" | "reviewCount" | "createdAt" | "updatedAt">, owner: UserDocument): Promise<CompanyDocument>;
    list(params: {
        page: number;
        limit: number;
        search?: string;
        industry?: string;
        location?: string;
        sort?: string;
    }): Promise<{
        data: {
            openJobs: number;
            _id?: ObjectId;
            ownerId: ObjectId;
            companyName: string;
            logo?: string;
            banner?: string;
            website?: string;
            industry: string;
            companySize: string;
            description: string;
            location: string;
            email?: string;
            phone?: string;
            socialLinks?: import("../types/index.js").SocialLinks;
            verified: boolean;
            rating: number;
            reviewCount: number;
            createdAt: Date;
            updatedAt: Date;
        }[];
        meta: import("../types/index.js").PaginationMeta;
    }>;
    getById(id: string): Promise<{
        openJobs: number;
        _id?: ObjectId;
        ownerId: ObjectId;
        companyName: string;
        logo?: string;
        banner?: string;
        website?: string;
        industry: string;
        companySize: string;
        description: string;
        location: string;
        email?: string;
        phone?: string;
        socialLinks?: import("../types/index.js").SocialLinks;
        verified: boolean;
        rating: number;
        reviewCount: number;
        createdAt: Date;
        updatedAt: Date;
    }>;
    update(id: string, updates: Partial<CompanyDocument>, requester: UserDocument): Promise<CompanyDocument>;
    remove(id: string, requester: UserDocument): Promise<{
        deleted: boolean;
    }>;
    uploadLogo(id: string, file: Express.Multer.File, requester: UserDocument): Promise<CompanyDocument>;
    uploadBanner(id: string, file: Express.Multer.File, requester: UserDocument): Promise<CompanyDocument>;
    getMine(ownerId: ObjectId): Promise<CompanyDocument[]>;
}
export declare const companyService: CompanyService;
//# sourceMappingURL=company.service.d.ts.map