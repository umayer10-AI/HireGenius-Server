import { ObjectId } from "mongodb";
import { BaseRepository } from "./base.repository.js";
import type { UserDocument } from "../interfaces/models.js";
export declare class UserRepository extends BaseRepository<UserDocument> {
    constructor();
    findByEmail(email: string): Promise<UserDocument | null>;
    findByBetterAuthId(id: string): Promise<UserDocument | null>;
    listUsers(params: {
        page: number;
        limit: number;
        search?: string;
        role?: string;
        sort?: string;
    }): Promise<{
        data: UserDocument[];
        total: number;
    }>;
    pushSavedJob(userId: ObjectId, jobId: ObjectId): Promise<void>;
    pullSavedJob(userId: ObjectId, jobId: ObjectId): Promise<void>;
    pushAppliedJob(userId: ObjectId, jobId: ObjectId): Promise<void>;
    addRecentlyViewed(userId: ObjectId, jobId: ObjectId): Promise<void>;
    addSearchHistory(userId: ObjectId, term: string): Promise<void>;
}
export declare const userRepository: UserRepository;
//# sourceMappingURL=user.repository.d.ts.map