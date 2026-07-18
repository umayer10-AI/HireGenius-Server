export type UserRole = "admin" | "recruiter" | "candidate";
export type JobStatus = "draft" | "active" | "closed" | "expired";
export type JobType = "full-time" | "part-time" | "contract" | "internship" | "freelance";
export type WorkMode = "remote" | "onsite" | "hybrid";
export type ApplicationStatus = "Applied" | "Reviewed" | "Shortlisted" | "Interview Scheduled" | "Accepted" | "Rejected";
export type NotificationType = "success" | "info" | "warning" | "error";
export interface EducationItem {
    institution: string;
    degree: string;
    field: string;
    startYear: number;
    endYear?: number;
    description?: string;
}
export interface ExperienceItem {
    company: string;
    title: string;
    startDate: string;
    endDate?: string;
    current: boolean;
    description: string;
}
export interface SocialLinks {
    linkedin?: string;
    twitter?: string;
    facebook?: string;
    github?: string;
    website?: string;
}
export interface SalaryRange {
    min: number;
    max: number;
}
export interface PaginationMeta {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
}
export interface ApiSuccessResponse<T> {
    success: true;
    message: string;
    data: T;
    meta?: PaginationMeta;
}
export interface ApiErrorResponse {
    success: false;
    message: string;
    error?: unknown;
}
export interface PaginationQuery {
    page?: number;
    limit?: number;
    search?: string;
    sort?: string;
    order?: "asc" | "desc";
}
//# sourceMappingURL=index.d.ts.map