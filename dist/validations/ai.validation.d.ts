import { z } from "zod";
export declare const resumeGenerateSchema: z.ZodObject<{
    name: z.ZodString;
    education: z.ZodString;
    experience: z.ZodString;
    projects: z.ZodDefault<z.ZodOptional<z.ZodString>>;
    skills: z.ZodArray<z.ZodString, "many">;
    achievements: z.ZodDefault<z.ZodOptional<z.ZodString>>;
    targetJob: z.ZodString;
    preferredCountry: z.ZodDefault<z.ZodOptional<z.ZodString>>;
    preferredIndustry: z.ZodDefault<z.ZodOptional<z.ZodString>>;
    version: z.ZodDefault<z.ZodEnum<["short", "long", "standard"]>>;
}, "strip", z.ZodTypeAny, {
    version: "long" | "short" | "standard";
    skills: string[];
    name: string;
    experience: string;
    education: string;
    projects: string;
    achievements: string;
    targetJob: string;
    preferredCountry: string;
    preferredIndustry: string;
}, {
    skills: string[];
    name: string;
    experience: string;
    education: string;
    targetJob: string;
    version?: "long" | "short" | "standard" | undefined;
    projects?: string | undefined;
    achievements?: string | undefined;
    preferredCountry?: string | undefined;
    preferredIndustry?: string | undefined;
}>;
export declare const coverLetterSchema: z.ZodObject<{
    jobTitle: z.ZodString;
    companyName: z.ZodString;
    resume: z.ZodDefault<z.ZodOptional<z.ZodString>>;
    skills: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    experience: z.ZodDefault<z.ZodOptional<z.ZodString>>;
    tone: z.ZodDefault<z.ZodEnum<["friendly", "professional", "formal"]>>;
}, "strip", z.ZodTypeAny, {
    companyName: string;
    skills: string[];
    experience: string;
    resume: string;
    jobTitle: string;
    tone: "friendly" | "professional" | "formal";
}, {
    companyName: string;
    jobTitle: string;
    skills?: string[] | undefined;
    experience?: string | undefined;
    resume?: string | undefined;
    tone?: "friendly" | "professional" | "formal" | undefined;
}>;
export declare const jobRecommendationSchema: z.ZodObject<{
    limit: z.ZodDefault<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    limit: number;
}, {
    limit?: number | undefined;
}>;
export declare const skillGapSchema: z.ZodObject<{
    jobId: z.ZodOptional<z.ZodString>;
    jobRequirements: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    targetRole: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    jobId?: string | undefined;
    jobRequirements?: string[] | undefined;
    targetRole?: string | undefined;
}, {
    jobId?: string | undefined;
    jobRequirements?: string[] | undefined;
    targetRole?: string | undefined;
}>;
export declare const interviewPrepSchema: z.ZodObject<{
    jobTitle: z.ZodString;
    difficulty: z.ZodDefault<z.ZodEnum<["easy", "medium", "hard"]>>;
    category: z.ZodDefault<z.ZodEnum<["technical", "hr", "behavioral", "all"]>>;
}, "strip", z.ZodTypeAny, {
    category: "technical" | "hr" | "behavioral" | "all";
    jobTitle: string;
    difficulty: "easy" | "medium" | "hard";
}, {
    jobTitle: string;
    category?: "technical" | "hr" | "behavioral" | "all" | undefined;
    difficulty?: "easy" | "medium" | "hard" | undefined;
}>;
export declare const jobDescriptionSchema: z.ZodObject<{
    jobTitle: z.ZodString;
    category: z.ZodString;
    skills: z.ZodArray<z.ZodString, "many">;
    experience: z.ZodString;
    responsibilities: z.ZodDefault<z.ZodOptional<z.ZodString>>;
    benefits: z.ZodDefault<z.ZodOptional<z.ZodString>>;
}, "strip", z.ZodTypeAny, {
    skills: string[];
    category: string;
    experience: string;
    responsibilities: string;
    benefits: string;
    jobTitle: string;
}, {
    skills: string[];
    category: string;
    experience: string;
    jobTitle: string;
    responsibilities?: string | undefined;
    benefits?: string | undefined;
}>;
export declare const candidateMatchSchema: z.ZodObject<{
    jobId: z.ZodString;
    candidateId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    jobId: string;
    candidateId: string;
}, {
    jobId: string;
    candidateId: string;
}>;
export declare const chatSchema: z.ZodObject<{
    message: z.ZodString;
    chatId: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    message: string;
    chatId?: string | undefined;
}, {
    message: string;
    chatId?: string | undefined;
}>;
export declare const renameChatSchema: z.ZodObject<{
    title: z.ZodString;
}, "strip", z.ZodTypeAny, {
    title: string;
}, {
    title: string;
}>;
//# sourceMappingURL=ai.validation.d.ts.map