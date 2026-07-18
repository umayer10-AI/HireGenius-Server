import { ObjectId } from "mongodb";
import type { UserDocument } from "../interfaces/models";
export declare class UserService {
    getMe(user: UserDocument): Promise<{
        profileCompletion: {
            percentage: number;
            missing: string[];
        };
        email: string;
        role: import("../types").UserRole;
        createdAt: Date;
        location?: string | undefined;
        skills: string[];
        savedJobs: ObjectId[];
        updatedAt: Date;
        github?: string | undefined;
        linkedin?: string | undefined;
        _id?: ObjectId | undefined;
        name: string;
        image?: string | undefined;
        phone?: string | undefined;
        bio?: string | undefined;
        experienceYears?: number | undefined;
        experience?: import("../types").ExperienceItem[] | undefined;
        education: import("../types").EducationItem[];
        resume?: string | undefined;
        portfolio?: string | undefined;
        appliedJobs: ObjectId[];
        isVerified: boolean;
        isPremium: boolean;
        emailVerified: boolean;
        betterAuthUserId?: string | undefined;
        notificationPreferences?: {
            email: boolean;
            push: boolean;
            applicationUpdates: boolean;
            interviewUpdates: boolean;
            marketing: boolean;
        } | undefined;
        privacy?: {
            publicProfile: boolean;
            hideEmail: boolean;
            hidePhone: boolean;
        } | undefined;
        searchHistory: string[];
        recentlyViewedJobs: ObjectId[];
        lastLoginAt?: Date | undefined;
        lastDevice?: string | undefined;
    }>;
    getById(id: string, requester?: UserDocument): Promise<Omit<UserDocument, "password">>;
    list(params: {
        page: number;
        limit: number;
        search?: string;
        role?: string;
        sort?: string;
    }): Promise<{
        data: Omit<UserDocument, "password">[];
        meta: import("../types").PaginationMeta;
    }>;
    update(id: string, updates: Partial<UserDocument>, requester: UserDocument): Promise<Omit<UserDocument, "password">>;
    setMyRole(user: UserDocument, role: "candidate" | "recruiter"): Promise<Omit<UserDocument, "password">>;
    remove(id: string, requester: UserDocument): Promise<{
        deleted: boolean;
    }>;
    uploadAvatar(userId: string, file: Express.Multer.File): Promise<Omit<UserDocument, "password">>;
    uploadResume(userId: string, file: Express.Multer.File): Promise<Omit<UserDocument, "password">>;
    deleteResume(userId: string): Promise<Omit<UserDocument, "password">>;
    clearSearchHistory(userId: string): Promise<Omit<UserDocument, "password">>;
    clearRecentlyViewed(userId: string): Promise<Omit<UserDocument, "password">>;
    getRecentlyViewedJobs(userId: ObjectId): Promise<ObjectId[]>;
}
export declare const userService: UserService;
//# sourceMappingURL=user.service.d.ts.map