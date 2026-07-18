"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.renameChatSchema = exports.chatSchema = exports.candidateMatchSchema = exports.jobDescriptionSchema = exports.interviewPrepSchema = exports.skillGapSchema = exports.jobRecommendationSchema = exports.coverLetterSchema = exports.resumeGenerateSchema = void 0;
const zod_1 = require("zod");
const common_validation_1 = require("./common.validation");
exports.resumeGenerateSchema = zod_1.z.object({
    name: zod_1.z.string().min(2),
    education: zod_1.z.string().min(5),
    experience: zod_1.z.string().min(5),
    projects: zod_1.z.string().optional().default(""),
    skills: zod_1.z.array(zod_1.z.string()).min(1),
    achievements: zod_1.z.string().optional().default(""),
    targetJob: zod_1.z.string().min(2),
    preferredCountry: zod_1.z.string().optional().default(""),
    preferredIndustry: zod_1.z.string().optional().default(""),
    version: zod_1.z.enum(["short", "long", "standard"]).default("standard"),
});
exports.coverLetterSchema = zod_1.z.object({
    jobTitle: zod_1.z.string().min(2),
    companyName: zod_1.z.string().min(2),
    resume: zod_1.z.string().optional().default(""),
    skills: zod_1.z.array(zod_1.z.string()).default([]),
    experience: zod_1.z.string().optional().default(""),
    tone: zod_1.z.enum(["friendly", "professional", "formal"]).default("professional"),
});
exports.jobRecommendationSchema = zod_1.z.object({
    limit: zod_1.z.coerce.number().min(1).max(20).default(6),
});
exports.skillGapSchema = zod_1.z.object({
    jobId: common_validation_1.objectIdSchema.optional(),
    jobRequirements: zod_1.z.array(zod_1.z.string()).optional(),
    targetRole: zod_1.z.string().optional(),
});
exports.interviewPrepSchema = zod_1.z.object({
    jobTitle: zod_1.z.string().min(2),
    difficulty: zod_1.z.enum(["easy", "medium", "hard"]).default("medium"),
    category: zod_1.z.enum(["technical", "hr", "behavioral", "all"]).default("all"),
});
exports.jobDescriptionSchema = zod_1.z.object({
    jobTitle: zod_1.z.string().min(2),
    category: zod_1.z.string().min(2),
    skills: zod_1.z.array(zod_1.z.string()).min(1),
    experience: zod_1.z.string().min(1),
    responsibilities: zod_1.z.string().optional().default(""),
    benefits: zod_1.z.string().optional().default(""),
});
exports.candidateMatchSchema = zod_1.z.object({
    jobId: common_validation_1.objectIdSchema,
    candidateId: common_validation_1.objectIdSchema,
});
exports.chatSchema = zod_1.z.object({
    message: zod_1.z.string().min(1).max(5000),
    chatId: common_validation_1.objectIdSchema.optional(),
});
exports.renameChatSchema = zod_1.z.object({
    title: zod_1.z.string().min(1).max(120),
});
//# sourceMappingURL=ai.validation.js.map