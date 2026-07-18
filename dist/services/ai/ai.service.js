"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.aiService = exports.AIService = void 0;
const env_1 = require("../../config/env");
const company_repository_1 = require("../../repositories/company.repository");
const job_repository_1 = require("../../repositories/job.repository");
const user_repository_1 = require("../../repositories/user.repository");
const repositories_1 = require("../../repositories");
const errors_1 = require("../../utils/errors");
const prompts_1 = require("../../prompts");
const provider_1 = require("./provider");
function parseJson(text) {
    const cleaned = text.replace(/```json|```/g, "").trim();
    return JSON.parse(cleaned);
}
class AIService {
    assertRateLimit(user) {
        const limit = user.isPremium ? env_1.env.AI_RATE_LIMIT_PREMIUM : env_1.env.AI_RATE_LIMIT_FREE;
        // Soft gate: premium unlimited feel via high limit; free limited via env
        if (!user.isPremium && limit <= 0) {
            throw new errors_1.ForbiddenError("AI usage limit reached. Upgrade to Premium for more access.");
        }
    }
    async generateResume(user, input) {
        this.assertRateLimit(user);
        const content = await (0, provider_1.safeAIComplete)([
            {
                role: "user",
                content: (0, prompts_1.resumePrompt)({
                    name: input.name,
                    education: input.education,
                    experience: input.experience,
                    projects: input.projects || "",
                    skills: input.skills,
                    achievements: input.achievements || "",
                    targetJob: input.targetJob,
                    preferredCountry: input.preferredCountry || "",
                    preferredIndustry: input.preferredIndustry || "",
                    version: input.version || "standard",
                }),
            },
        ]);
        if (user._id) {
            const now = new Date();
            await repositories_1.aiRepository.saveResumeGeneration({
                userId: user._id,
                resumePrompt: input.targetJob,
                generatedResume: content,
                createdAt: now,
                updatedAt: now,
            });
        }
        return { resume: content };
    }
    async generateCoverLetter(user, input) {
        this.assertRateLimit(user);
        const content = await (0, provider_1.safeAIComplete)([
            {
                role: "user",
                content: (0, prompts_1.coverLetterPrompt)({
                    jobTitle: input.jobTitle,
                    companyName: input.companyName,
                    resume: input.resume || user.resume || "",
                    skills: input.skills || user.skills || [],
                    experience: input.experience || "",
                    tone: input.tone || "professional",
                }),
            },
        ]);
        return { coverLetter: content };
    }
    async recommendJobs(user, limit = 6) {
        this.assertRateLimit(user);
        const jobs = await job_repository_1.jobRepository.findMany({ status: "active" }, { limit: 40, sort: { createdAt: -1 } });
        const jobPayload = await Promise.all(jobs.map(async (job) => {
            const company = await company_repository_1.companyRepository.findById(job.companyId);
            return {
                id: job._id.toString(),
                title: job.title,
                company: company?.companyName || "Company",
                skills: job.skills,
                location: job.location,
                salary: `${job.salary.min}-${job.salary.max} ${job.currency}`,
            };
        }));
        const raw = await (0, provider_1.safeAIComplete)([
            {
                role: "user",
                content: (0, prompts_1.recommendationPrompt)({
                    skills: user.skills || [],
                    experience: JSON.stringify(user.experience || []),
                    location: user.location,
                    education: JSON.stringify(user.education || []),
                    jobs: jobPayload,
                }),
            },
        ]);
        let matches = [];
        try {
            matches = parseJson(raw);
        }
        catch {
            matches = jobPayload.slice(0, limit).map((j, i) => ({
                jobId: j.id,
                score: 90 - i * 5,
                reasons: ["Skill overlap with your profile", "Active opportunity match"],
            }));
        }
        const detailed = await Promise.all(matches.slice(0, limit).map(async (match) => {
            const job = await job_repository_1.jobRepository.findById(match.jobId);
            const company = job ? await company_repository_1.companyRepository.findById(job.companyId) : null;
            return { ...match, job, company };
        }));
        return { recommendations: detailed.filter((d) => d.job) };
    }
    async skillGapAnalysis(user, input) {
        this.assertRateLimit(user);
        let requirements = input.jobRequirements || [];
        let targetRole = input.targetRole || "Target Role";
        if (input.jobId) {
            const job = await job_repository_1.jobRepository.findByIdOrThrow(input.jobId, "Job not found");
            requirements = [...job.skills, ...job.requirements];
            targetRole = job.title;
        }
        const raw = await (0, provider_1.safeAIComplete)([
            {
                role: "user",
                content: (0, prompts_1.skillGapPrompt)({
                    currentSkills: user.skills || [],
                    requirements,
                    targetRole,
                }),
            },
        ]);
        try {
            return parseJson(raw);
        }
        catch {
            return {
                missingSkills: requirements.filter((r) => !user.skills?.some((s) => s.toLowerCase() === r.toLowerCase())),
                learningRoadmap: [],
                recommendedTechnologies: requirements.slice(0, 5),
                estimatedLearningTime: "4-8 weeks",
            };
        }
    }
    async interviewPrep(user, input) {
        this.assertRateLimit(user);
        const raw = await (0, provider_1.safeAIComplete)([
            {
                role: "user",
                content: (0, prompts_1.interviewPrepPrompt)({
                    jobTitle: input.jobTitle,
                    difficulty: input.difficulty || "medium",
                    category: input.category || "all",
                }),
            },
        ]);
        try {
            return parseJson(raw);
        }
        catch {
            throw new errors_1.AppError("Failed to parse interview preparation response", 502);
        }
    }
    async generateJobDescription(user, input) {
        this.assertRateLimit(user);
        if (user.role !== "recruiter" && user.role !== "admin") {
            throw new errors_1.ForbiddenError("Only recruiters can generate job descriptions");
        }
        const raw = await (0, provider_1.safeAIComplete)([
            {
                role: "user",
                content: (0, prompts_1.jobDescriptionPrompt)({
                    jobTitle: input.jobTitle,
                    category: input.category,
                    skills: input.skills,
                    experience: input.experience,
                    responsibilities: input.responsibilities || "",
                    benefits: input.benefits || "",
                }),
            },
        ]);
        try {
            return parseJson(raw);
        }
        catch {
            throw new errors_1.AppError("Failed to parse job description", 502);
        }
    }
    async candidateMatch(user, input) {
        this.assertRateLimit(user);
        if (user.role !== "recruiter" && user.role !== "admin") {
            throw new errors_1.ForbiddenError("Only recruiters can run candidate match");
        }
        const job = await job_repository_1.jobRepository.findByIdOrThrow(input.jobId, "Job not found");
        const candidate = await user_repository_1.userRepository.findByIdOrThrow(input.candidateId, "Candidate not found");
        const raw = await (0, provider_1.safeAIComplete)([
            {
                role: "user",
                content: (0, prompts_1.candidateMatchPrompt)({
                    jobTitle: job.title,
                    jobSkills: job.skills,
                    requirements: job.requirements,
                    candidate: {
                        name: candidate.name,
                        skills: candidate.skills || [],
                        experience: JSON.stringify(candidate.experience || []),
                        education: JSON.stringify(candidate.education || []),
                        resume: candidate.resume,
                    },
                }),
            },
        ]);
        try {
            return parseJson(raw);
        }
        catch {
            throw new errors_1.AppError("Failed to parse candidate match analysis", 502);
        }
    }
    async chat(user, input, onChunk) {
        this.assertRateLimit(user);
        if (!user._id)
            throw new errors_1.ForbiddenError("Invalid user");
        let chat = input.chatId ? await repositories_1.aiRepository.getChat(input.chatId) : null;
        if (input.chatId && (!chat || chat.userId.toString() !== user._id.toString())) {
            throw new errors_1.NotFoundError("Chat not found");
        }
        const system = {
            role: "system",
            content: (0, prompts_1.careerChatPrompt)({
                userName: user.name,
                role: user.role,
                skills: user.skills || [],
                location: user.location,
                resume: user.resume,
                savedJobsCount: user.savedJobs?.length || 0,
                appliedJobsCount: user.appliedJobs?.length || 0,
            }),
        };
        const history = (chat?.conversation || []).map((m) => ({
            role: m.role,
            content: m.content,
        }));
        const messages = [
            system,
            ...history,
            { role: "user", content: input.message },
        ];
        const provider = (0, provider_1.getAIProvider)();
        const reply = onChunk
            ? await provider.stream(messages, onChunk)
            : await provider.complete(messages);
        const now = new Date();
        const userMsg = { role: "user", content: input.message, createdAt: now };
        const assistantMsg = { role: "assistant", content: reply, createdAt: new Date() };
        if (!chat) {
            chat = await repositories_1.aiRepository.createChat({
                userId: user._id,
                title: input.message.slice(0, 60),
                conversation: [userMsg, assistantMsg],
                createdAt: now,
                updatedAt: now,
            });
        }
        else {
            chat = await repositories_1.aiRepository.updateChat(chat._id.toString(), {
                conversation: [...chat.conversation, userMsg, assistantMsg],
            });
        }
        const suggestions = [
            "Improve my resume",
            "Generate a cover letter",
            "Find better matching jobs",
            "Practice interview questions",
        ];
        return { chat, reply, suggestions };
    }
    async listChats(user, page, limit) {
        if (!user._id)
            throw new errors_1.ForbiddenError("Invalid user");
        return repositories_1.aiRepository.listChats(user._id, page, limit);
    }
    async renameChat(user, chatId, title) {
        const chat = await repositories_1.aiRepository.getChat(chatId);
        if (!chat || chat.userId.toString() !== user._id?.toString()) {
            throw new errors_1.NotFoundError("Chat not found");
        }
        return repositories_1.aiRepository.updateChat(chatId, { title });
    }
    async deleteChat(user, chatId) {
        const chat = await repositories_1.aiRepository.getChat(chatId);
        if (!chat || chat.userId.toString() !== user._id?.toString()) {
            throw new errors_1.NotFoundError("Chat not found");
        }
        await repositories_1.aiRepository.deleteChat(chatId);
        return { deleted: true };
    }
}
exports.AIService = AIService;
exports.aiService = new AIService();
//# sourceMappingURL=ai.service.js.map