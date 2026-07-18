import type { BlogDocument, ReviewDocument, UserDocument } from "../interfaces/models";
export declare class ReviewService {
    create(input: {
        companyId: string;
        rating: number;
        comment: string;
    }, user: UserDocument): Promise<ReviewDocument>;
    list(params: {
        page: number;
        limit: number;
        companyId?: string;
    }): Promise<{
        data: ReviewDocument[];
        meta: import("../types").PaginationMeta;
    }>;
    update(id: string, updates: Partial<Pick<ReviewDocument, "rating" | "comment">>, user: UserDocument): Promise<ReviewDocument>;
    remove(id: string, user: UserDocument): Promise<{
        deleted: boolean;
    }>;
}
export declare class BlogService {
    create(data: Omit<BlogDocument, "_id" | "slug" | "createdAt" | "updatedAt" | "authorId">, user: UserDocument): Promise<BlogDocument>;
    list(params: {
        page: number;
        limit: number;
        search?: string;
        tag?: string;
        published?: boolean;
        sort?: string;
    }): Promise<{
        data: BlogDocument[];
        meta: import("../types").PaginationMeta;
    }>;
    getBySlug(slug: string): Promise<BlogDocument>;
    getById(id: string): Promise<BlogDocument>;
    update(id: string, updates: Partial<BlogDocument>, user: UserDocument): Promise<BlogDocument>;
    remove(id: string, user: UserDocument): Promise<{
        deleted: boolean;
    }>;
}
export declare const reviewService: ReviewService;
export declare const blogService: BlogService;
//# sourceMappingURL=review.service.d.ts.map