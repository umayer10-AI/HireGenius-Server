import { env } from "../../config/env.js";
import type { UserDocument } from "../../interfaces/models.js";
import { companyRepository } from "../../repositories/company.repository.js";
import { jobRepository } from "../../repositories/job.repository.js";
import { userRepository } from "../../repositories/user.repository.js";
import { aiRepository } from "../../repositories/index.js";
import { AppError, ForbiddenError, NotFoundError } from "../../utils/errors.js";
import {
  candidateMatchPrompt,
  careerChatPrompt,
  coverLetterPrompt,
  interviewPrepPrompt,
  jobDescriptionPrompt,
  recommendationPrompt,
  resumePrompt,
  skillGapPrompt,
} from "../../prompts/index.js";
import { getAIProvider, safeAIComplete, type AIMessage } from "./provider.js";

function parseJson<T>(text: string): T {
  const cleaned = text.replace(/```json|```/g, "").trim();
  return JSON.parse(cleaned) as T;
}

export class AIService {
  private assertRateLimit(user: UserDocument) {
    const limit = user.isPremium ? env.AI_RATE_LIMIT_PREMIUM : env.AI_RATE_LIMIT_FREE;
    // Soft gate: premium unlimited feel via high limit; free limited via env
    if (!user.isPremium && limit <= 0) {
      throw new ForbiddenError("AI usage limit reached. Upgrade to Premium for more access.");
    }
  }

  async generateResume(
    user: UserDocument,
    input: {
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
    }
  ) {
    this.assertRateLimit(user);
    const content = await safeAIComplete([
      {
        role: "user",
        content: resumePrompt({
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
      await aiRepository.saveResumeGeneration({
        userId: user._id,
        resumePrompt: input.targetJob,
        generatedResume: content,
        createdAt: now,
        updatedAt: now,
      });
    }

    return { resume: content };
  }

  async generateCoverLetter(
    user: UserDocument,
    input: {
      jobTitle: string;
      companyName: string;
      resume?: string;
      skills?: string[];
      experience?: string;
      tone?: "friendly" | "professional" | "formal";
    }
  ) {
    this.assertRateLimit(user);
    const content = await safeAIComplete([
      {
        role: "user",
        content: coverLetterPrompt({
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

  async recommendJobs(user: UserDocument, limit = 6) {
    this.assertRateLimit(user);
    const jobs = await jobRepository.findMany(
      { status: "active" },
      { limit: 40, sort: { createdAt: -1 } }
    );

    const jobPayload = await Promise.all(
      jobs.map(async (job) => {
        const company = await companyRepository.findById(job.companyId);
        return {
          id: job._id!.toString(),
          title: job.title,
          company: company?.companyName || "Company",
          skills: job.skills,
          location: job.location,
          salary: `${job.salary.min}-${job.salary.max} ${job.currency}`,
        };
      })
    );

    const raw = await safeAIComplete([
      {
        role: "user",
        content: recommendationPrompt({
          skills: user.skills || [],
          experience: JSON.stringify(user.experience || []),
          location: user.location,
          education: JSON.stringify(user.education || []),
          jobs: jobPayload,
        }),
      },
    ]);

    let matches: Array<{ jobId: string; score: number; reasons: string[] }> = [];
    try {
      matches = parseJson(raw);
    } catch {
      matches = jobPayload.slice(0, limit).map((j, i) => ({
        jobId: j.id,
        score: 90 - i * 5,
        reasons: ["Skill overlap with your profile", "Active opportunity match"],
      }));
    }

    const detailed = await Promise.all(
      matches.slice(0, limit).map(async (match) => {
        const job = await jobRepository.findById(match.jobId);
        const company = job ? await companyRepository.findById(job.companyId) : null;
        return { ...match, job, company };
      })
    );

    return { recommendations: detailed.filter((d) => d.job) };
  }

  async skillGapAnalysis(
    user: UserDocument,
    input: { jobId?: string; jobRequirements?: string[]; targetRole?: string }
  ) {
    this.assertRateLimit(user);
    let requirements = input.jobRequirements || [];
    let targetRole = input.targetRole || "Target Role";

    if (input.jobId) {
      const job = await jobRepository.findByIdOrThrow(input.jobId, "Job not found");
      requirements = [...job.skills, ...job.requirements];
      targetRole = job.title;
    }

    const raw = await safeAIComplete([
      {
        role: "user",
        content: skillGapPrompt({
          currentSkills: user.skills || [],
          requirements,
          targetRole,
        }),
      },
    ]);

    try {
      return parseJson(raw);
    } catch {
      return {
        missingSkills: requirements.filter(
          (r) => !user.skills?.some((s) => s.toLowerCase() === r.toLowerCase())
        ),
        learningRoadmap: [],
        recommendedTechnologies: requirements.slice(0, 5),
        estimatedLearningTime: "4-8 weeks",
      };
    }
  }

  async interviewPrep(
    user: UserDocument,
    input: {
      jobTitle: string;
      difficulty?: "easy" | "medium" | "hard";
      category?: "technical" | "hr" | "behavioral" | "all";
    }
  ) {
    this.assertRateLimit(user);
    const raw = await safeAIComplete([
      {
        role: "user",
        content: interviewPrepPrompt({
          jobTitle: input.jobTitle,
          difficulty: input.difficulty || "medium",
          category: input.category || "all",
        }),
      },
    ]);
    try {
      return parseJson(raw);
    } catch {
      throw new AppError("Failed to parse interview preparation response", 502);
    }
  }

  async generateJobDescription(
    user: UserDocument,
    input: {
      jobTitle: string;
      category: string;
      skills: string[];
      experience: string;
      responsibilities?: string;
      benefits?: string;
    }
  ) {
    this.assertRateLimit(user);
    if (user.role !== "recruiter" && user.role !== "admin") {
      throw new ForbiddenError("Only recruiters can generate job descriptions");
    }
    const raw = await safeAIComplete([
      {
        role: "user",
        content: jobDescriptionPrompt({
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
    } catch {
      throw new AppError("Failed to parse job description", 502);
    }
  }

  async candidateMatch(
    user: UserDocument,
    input: { jobId: string; candidateId: string }
  ) {
    this.assertRateLimit(user);
    if (user.role !== "recruiter" && user.role !== "admin") {
      throw new ForbiddenError("Only recruiters can run candidate match");
    }

    const job = await jobRepository.findByIdOrThrow(input.jobId, "Job not found");
    const candidate = await userRepository.findByIdOrThrow(
      input.candidateId,
      "Candidate not found"
    );

    const raw = await safeAIComplete([
      {
        role: "user",
        content: candidateMatchPrompt({
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
    } catch {
      throw new AppError("Failed to parse candidate match analysis", 502);
    }
  }

  async chat(
    user: UserDocument,
    input: { message: string; chatId?: string },
    onChunk?: (chunk: string) => void
  ) {
    this.assertRateLimit(user);
    if (!user._id) throw new ForbiddenError("Invalid user");

    let chat = input.chatId ? await aiRepository.getChat(input.chatId) : null;
    if (input.chatId && (!chat || chat.userId.toString() !== user._id.toString())) {
      throw new NotFoundError("Chat not found");
    }

    const system: AIMessage = {
      role: "system",
      content: careerChatPrompt({
        userName: user.name,
        role: user.role,
        skills: user.skills || [],
        location: user.location,
        resume: user.resume,
        savedJobsCount: user.savedJobs?.length || 0,
        appliedJobsCount: user.appliedJobs?.length || 0,
      }),
    };

    const history: AIMessage[] = (chat?.conversation || []).map((m) => ({
      role: m.role,
      content: m.content,
    }));

    const messages: AIMessage[] = [
      system,
      ...history,
      { role: "user", content: input.message },
    ];

    const provider = getAIProvider();
    const reply = onChunk
      ? await provider.stream(messages, onChunk)
      : await provider.complete(messages);

    const now = new Date();
    const userMsg = { role: "user" as const, content: input.message, createdAt: now };
    const assistantMsg = { role: "assistant" as const, content: reply, createdAt: new Date() };

    if (!chat) {
      chat = await aiRepository.createChat({
        userId: user._id,
        title: input.message.slice(0, 60),
        conversation: [userMsg, assistantMsg],
        createdAt: now,
        updatedAt: now,
      });
    } else {
      chat = await aiRepository.updateChat(chat._id!.toString(), {
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

  async listChats(user: UserDocument, page: number, limit: number) {
    if (!user._id) throw new ForbiddenError("Invalid user");
    return aiRepository.listChats(user._id, page, limit);
  }

  async renameChat(user: UserDocument, chatId: string, title: string) {
    const chat = await aiRepository.getChat(chatId);
    if (!chat || chat.userId.toString() !== user._id?.toString()) {
      throw new NotFoundError("Chat not found");
    }
    return aiRepository.updateChat(chatId, { title });
  }

  async deleteChat(user: UserDocument, chatId: string) {
    const chat = await aiRepository.getChat(chatId);
    if (!chat || chat.userId.toString() !== user._id?.toString()) {
      throw new NotFoundError("Chat not found");
    }
    await aiRepository.deleteChat(chatId);
    return { deleted: true };
  }
}

export const aiService = new AIService();
