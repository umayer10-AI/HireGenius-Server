import { ObjectId } from "mongodb";
import type { ApplicationStatus, EducationItem, ExperienceItem, JobStatus, JobType, NotificationType, SalaryRange, SocialLinks, UserRole, WorkMode } from "../types";
export interface UserDocument {
    _id?: ObjectId;
    name: string;
    email: string;
    password?: string;
    image?: string;
    role: UserRole;
    phone?: string;
    bio?: string;
    skills: string[];
    experienceYears?: number;
    experience?: ExperienceItem[];
    education: EducationItem[];
    resume?: string;
    portfolio?: string;
    github?: string;
    linkedin?: string;
    location?: string;
    savedJobs: ObjectId[];
    appliedJobs: ObjectId[];
    isVerified: boolean;
    isPremium: boolean;
    emailVerified: boolean;
    betterAuthUserId?: string;
    notificationPreferences?: {
        email: boolean;
        push: boolean;
        applicationUpdates: boolean;
        interviewUpdates: boolean;
        marketing: boolean;
    };
    privacy?: {
        publicProfile: boolean;
        hideEmail: boolean;
        hidePhone: boolean;
    };
    searchHistory: string[];
    recentlyViewedJobs: ObjectId[];
    lastLoginAt?: Date;
    lastDevice?: string;
    createdAt: Date;
    updatedAt: Date;
}
export interface CompanyDocument {
    _id?: ObjectId;
    ownerId: ObjectId;
    companyName: string;
    logo?: string;
    banner?: string;
    website?: string;
    industry: string;
    companySize: string;
    description: string;
    location: string;
    email?: string;
    phone?: string;
    socialLinks?: SocialLinks;
    verified: boolean;
    rating: number;
    reviewCount: number;
    createdAt: Date;
    updatedAt: Date;
}
export interface JobDocument {
    _id?: ObjectId;
    companyId: ObjectId;
    createdBy: ObjectId;
    title: string;
    slug: string;
    shortDescription: string;
    description: string;
    requirements: string[];
    responsibilities: string[];
    benefits: string[];
    skills: string[];
    salary: SalaryRange;
    currency: string;
    experience: string;
    category: string;
    jobType: JobType;
    workMode: WorkMode;
    location: string;
    vacancies: number;
    applicationDeadline: Date;
    featured: boolean;
    status: JobStatus;
    bannerImage?: string;
    views: number;
    createdAt: Date;
    updatedAt: Date;
}
export interface ApplicationDocument {
    _id?: ObjectId;
    jobId: ObjectId;
    candidateId: ObjectId;
    resume: string;
    coverLetter?: string;
    expectedSalary?: number;
    portfolio?: string;
    github?: string;
    linkedin?: string;
    status: ApplicationStatus;
    notes?: string;
    createdAt: Date;
    updatedAt: Date;
}
export interface SavedJobDocument {
    _id?: ObjectId;
    userId: ObjectId;
    jobId: ObjectId;
    createdAt: Date;
    updatedAt: Date;
}
export interface ReviewDocument {
    _id?: ObjectId;
    companyId: ObjectId;
    userId: ObjectId;
    rating: number;
    comment: string;
    createdAt: Date;
    updatedAt: Date;
}
export interface BlogDocument {
    _id?: ObjectId;
    title: string;
    slug: string;
    description: string;
    content: string;
    image?: string;
    author: string;
    authorId?: ObjectId;
    tags: string[];
    published: boolean;
    createdAt: Date;
    updatedAt: Date;
}
export interface NotificationDocument {
    _id?: ObjectId;
    receiverId: ObjectId;
    title: string;
    message: string;
    type: NotificationType;
    isRead: boolean;
    link?: string;
    createdAt: Date;
    updatedAt: Date;
}
export interface AIChatMessage {
    role: "user" | "assistant" | "system";
    content: string;
    createdAt: Date;
}
export interface AIChatDocument {
    _id?: ObjectId;
    userId: ObjectId;
    title: string;
    conversation: AIChatMessage[];
    createdAt: Date;
    updatedAt: Date;
}
export interface ResumeGenerationDocument {
    _id?: ObjectId;
    userId: ObjectId;
    resumePrompt: string;
    generatedResume: string;
    generatedCoverLetter?: string;
    createdAt: Date;
    updatedAt: Date;
}
export interface ContactMessageDocument {
    _id?: ObjectId;
    name: string;
    email: string;
    subject: string;
    message: string;
    createdAt: Date;
    updatedAt: Date;
}
export interface NewsletterSubscriberDocument {
    _id?: ObjectId;
    email: string;
    createdAt: Date;
    updatedAt: Date;
}
//# sourceMappingURL=models.d.ts.map