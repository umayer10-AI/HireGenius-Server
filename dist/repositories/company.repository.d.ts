import { ObjectId } from "mongodb";
import { BaseRepository } from "./base.repository.js";
import type { CompanyDocument } from "../interfaces/models.js";
export declare class CompanyRepository extends BaseRepository<CompanyDocument> {
    constructor();
    list(params: {
        page: number;
        limit: number;
        search?: string;
        industry?: string;
        location?: string;
        sort?: string;
    }): Promise<{
        data: CompanyDocument[];
        total: number;
    }>;
    findByOwner(ownerId: ObjectId): Promise<CompanyDocument[]>;
    updateRating(companyId: ObjectId, rating: number, reviewCount: number): Promise<void>;
}
export declare const companyRepository: CompanyRepository;
//# sourceMappingURL=company.repository.d.ts.map