import { ObjectId } from "mongodb";
import { BaseRepository } from "./base.repository.js";
import type { AIChatDocument, BlogDocument, NotificationDocument, ResumeGenerationDocument, ReviewDocument, SavedJobDocument } from "../interfaces/models.js";
export declare class SavedJobRepository extends BaseRepository<SavedJobDocument> {
    constructor();
    listByUser(userId: ObjectId, page: number, limit: number): Promise<{
        data: SavedJobDocument[];
        total: number;
    }>;
    findExisting(userId: ObjectId, jobId: ObjectId): Promise<SavedJobDocument | null>;
    deleteByUserAndJob(userId: ObjectId, jobId: ObjectId): Promise<boolean>;
}
export declare class ReviewRepository extends BaseRepository<ReviewDocument> {
    constructor();
    list(params: {
        page: number;
        limit: number;
        companyId?: string;
    }): Promise<{
        data: ReviewDocument[];
        total: number;
    }>;
    findExisting(userId: ObjectId, companyId: ObjectId): Promise<ReviewDocument | null>;
    getCompanyStats(companyId: ObjectId): Promise<{
        avg: number;
        count: number;
    }>;
}
export declare class BlogRepository extends BaseRepository<BlogDocument> {
    constructor();
    list(params: {
        page: number;
        limit: number;
        search?: string;
        tag?: string;
        published?: boolean;
        sort?: string;
    }): Promise<{
        data: BlogDocument[];
        total: number;
    }>;
    findBySlug(slug: string): Promise<BlogDocument | null>;
}
export declare class NotificationRepository extends BaseRepository<NotificationDocument> {
    constructor();
    listByUser(userId: ObjectId, page: number, limit: number): Promise<{
        data: NotificationDocument[];
        total: number;
    }>;
    unreadCount(userId: ObjectId): Promise<number>;
    markAllRead(userId: ObjectId): Promise<number>;
}
export declare class AIRepository {
    private chats;
    private resumes;
    createChat(doc: AIChatDocument): Promise<AIChatDocument>;
    getChat(id: string): Promise<AIChatDocument | null>;
    listChats(userId: ObjectId, page: number, limit: number): Promise<{
        data: AIChatDocument[];
        total: number;
    }>;
    updateChat(id: string, update: Partial<AIChatDocument>): Promise<AIChatDocument>;
    deleteChat(id: string): Promise<boolean>;
    saveResumeGeneration(doc: ResumeGenerationDocument): Promise<ResumeGenerationDocument>;
    listResumeGenerations(userId: ObjectId, page: number, limit: number): Promise<{
        data: ResumeGenerationDocument[];
        total: number;
    }>;
}
export declare const savedJobRepository: SavedJobRepository;
export declare const reviewRepository: ReviewRepository;
export declare const blogRepository: BlogRepository;
export declare const notificationRepository: NotificationRepository;
export declare const aiRepository: AIRepository;
//# sourceMappingURL=index.d.ts.map