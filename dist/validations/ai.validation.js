import { z } from "zod";
import { objectIdSchema } from "./common.validation.js";
export const resumeGenerateSchema = z.object({
    name: z.string().min(2),
    education: z.string().min(5),
    experience: z.string().min(5),
    projects: z.string().optional().default(""),
    skills: z.array(z.string()).min(1),
    achievements: z.string().optional().default(""),
    targetJob: z.string().min(2),
    preferredCountry: z.string().optional().default(""),
    preferredIndustry: z.string().optional().default(""),
    version: z.enum(["short", "long", "standard"]).default("standard"),
});
export const coverLetterSchema = z.object({
    jobTitle: z.string().min(2),
    companyName: z.string().min(2),
    resume: z.string().optional().default(""),
    skills: z.array(z.string()).default([]),
    experience: z.string().optional().default(""),
    tone: z.enum(["friendly", "professional", "formal"]).default("professional"),
});
export const jobRecommendationSchema = z.object({
    limit: z.coerce.number().min(1).max(20).default(6),
});
export const skillGapSchema = z.object({
    jobId: objectIdSchema.optional(),
    jobRequirements: z.array(z.string()).optional(),
    targetRole: z.string().optional(),
});
export const interviewPrepSchema = z.object({
    jobTitle: z.string().min(2),
    difficulty: z.enum(["easy", "medium", "hard"]).default("medium"),
    category: z.enum(["technical", "hr", "behavioral", "all"]).default("all"),
});
export const jobDescriptionSchema = z.object({
    jobTitle: z.string().min(2),
    category: z.string().min(2),
    skills: z.array(z.string()).min(1),
    experience: z.string().min(1),
    responsibilities: z.string().optional().default(""),
    benefits: z.string().optional().default(""),
});
export const candidateMatchSchema = z.object({
    jobId: objectIdSchema,
    candidateId: objectIdSchema,
});
export const chatSchema = z.object({
    message: z.string().min(1).max(5000),
    chatId: objectIdSchema.optional(),
});
export const renameChatSchema = z.object({
    title: z.string().min(1).max(120),
});
//# sourceMappingURL=ai.validation.js.map