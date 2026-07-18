import type { UserDocument } from "../../interfaces/models";
export declare class AIService {
    private assertRateLimit;
    generateResume(user: UserDocument, input: {
        name: string;
        education: string;
        experience: string;
        projects?: string;
        skills: string[];
        achievements?: string;
        targetJob: string;
        preferredCountry?: string;
        preferredIndustry?: string;
        version?: "short" | "long" | "standard";
    }): Promise<{
        resume: string;
    }>;
    generateCoverLetter(user: UserDocument, input: {
        jobTitle: string;
        companyName: string;
        resume?: string;
        skills?: string[];
        experience?: string;
        tone?: "friendly" | "professional" | "formal";
    }): Promise<{
        coverLetter: string;
    }>;
    recommendJobs(user: UserDocument, limit?: number): Promise<{
        recommendations: {
            job: import("../../interfaces/models").JobDocument | null;
            company: import("../../interfaces/models").CompanyDocument | null;
            jobId: string;
            score: number;
            reasons: string[];
        }[];
    }>;
    skillGapAnalysis(user: UserDocument, input: {
        jobId?: string;
        jobRequirements?: string[];
        targetRole?: string;
    }): Promise<unknown>;
    interviewPrep(user: UserDocument, input: {
        jobTitle: string;
        difficulty?: "easy" | "medium" | "hard";
        category?: "technical" | "hr" | "behavioral" | "all";
    }): Promise<unknown>;
    generateJobDescription(user: UserDocument, input: {
        jobTitle: string;
        category: string;
        skills: string[];
        experience: string;
        responsibilities?: string;
        benefits?: string;
    }): Promise<unknown>;
    candidateMatch(user: UserDocument, input: {
        jobId: string;
        candidateId: string;
    }): Promise<unknown>;
    chat(user: UserDocument, input: {
        message: string;
        chatId?: string;
    }, onChunk?: (chunk: string) => void): Promise<{
        chat: import("../../interfaces/models").AIChatDocument;
        reply: string;
        suggestions: string[];
    }>;
    listChats(user: UserDocument, page: number, limit: number): Promise<{
        data: import("../../interfaces/models").AIChatDocument[];
        total: number;
    }>;
    renameChat(user: UserDocument, chatId: string, title: string): Promise<import("../../interfaces/models").AIChatDocument>;
    deleteChat(user: UserDocument, chatId: string): Promise<{
        deleted: boolean;
    }>;
}
export declare const aiService: AIService;
//# sourceMappingURL=ai.service.d.ts.map