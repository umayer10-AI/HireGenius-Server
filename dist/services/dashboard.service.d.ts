import type { ApplicationDocument, JobDocument, UserDocument } from "../interfaces/models.js";
export declare class DashboardService {
    getCandidateDashboard(user: UserDocument): Promise<{
        stats: {
            appliedJobs: number;
            savedJobs: number;
            interviews: number;
            profileCompletion: number;
        };
        recentApplications: import("mongodb").WithId<ApplicationDocument>[];
        recommendedJobs: import("mongodb").WithId<JobDocument>[];
        charts: {
            statusBreakdown: {
                name: string;
                value: number;
            }[];
            monthlyApplications: {
                name: string;
                value: number;
            }[];
        };
    }>;
    getRecruiterDashboard(user: UserDocument): Promise<{
        stats: {
            jobsPosted: number;
            activeJobs: number;
            expiredJobs: number;
            applications: number;
            companies: number;
        };
        recentApplicants: import("mongodb").WithId<ApplicationDocument>[];
        charts: {
            applicationsTrend: {
                name: string;
                value: number;
            }[];
            jobsByStatus: {
                name: string;
                value: number;
            }[];
        };
    }>;
    getAdminDashboard(): Promise<{
        stats: {
            users: number;
            recruiters: number;
            candidates: number;
            companies: number;
            jobs: number;
            applications: number;
        };
        charts: {
            userGrowth: {
                name: string;
                value: number;
            }[];
            roleDistribution: {
                name: string;
                value: number;
            }[];
        };
    }>;
    getPlatformStats(): Promise<{
        jobs: number;
        companies: number;
        candidates: number;
        recruiters: number;
        applications: number;
    }>;
}
export declare const dashboardService: DashboardService;
//# sourceMappingURL=dashboard.service.d.ts.map