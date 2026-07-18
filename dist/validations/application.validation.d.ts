import { z } from "zod";
export declare const createApplicationSchema: z.ZodObject<{
    jobId: z.ZodString;
    resume: z.ZodOptional<z.ZodString>;
    coverLetter: z.ZodOptional<z.ZodString>;
    expectedSalary: z.ZodOptional<z.ZodNumber>;
    portfolio: z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>;
    github: z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>;
    linkedin: z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>;
}, "strip", z.ZodTypeAny, {
    jobId: string;
    github?: string | undefined;
    linkedin?: string | undefined;
    resume?: string | undefined;
    portfolio?: string | undefined;
    coverLetter?: string | undefined;
    expectedSalary?: number | undefined;
}, {
    jobId: string;
    github?: string | undefined;
    linkedin?: string | undefined;
    resume?: string | undefined;
    portfolio?: string | undefined;
    coverLetter?: string | undefined;
    expectedSalary?: number | undefined;
}>;
export declare const updateApplicationSchema: z.ZodObject<{
    status: z.ZodOptional<z.ZodEnum<["Applied", "Reviewed", "Shortlisted", "Interview Scheduled", "Accepted", "Rejected"]>>;
    notes: z.ZodOptional<z.ZodString>;
    coverLetter: z.ZodOptional<z.ZodString>;
    expectedSalary: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    status?: "Applied" | "Reviewed" | "Shortlisted" | "Interview Scheduled" | "Accepted" | "Rejected" | undefined;
    coverLetter?: string | undefined;
    expectedSalary?: number | undefined;
    notes?: string | undefined;
}, {
    status?: "Applied" | "Reviewed" | "Shortlisted" | "Interview Scheduled" | "Accepted" | "Rejected" | undefined;
    coverLetter?: string | undefined;
    expectedSalary?: number | undefined;
    notes?: string | undefined;
}>;
export declare const applicationQuerySchema: z.ZodObject<{
    page: z.ZodDefault<z.ZodNumber>;
    limit: z.ZodDefault<z.ZodNumber>;
    search: z.ZodDefault<z.ZodOptional<z.ZodString>>;
    sort: z.ZodDefault<z.ZodOptional<z.ZodString>>;
    order: z.ZodDefault<z.ZodOptional<z.ZodEnum<["asc", "desc"]>>>;
} & {
    status: z.ZodOptional<z.ZodString>;
    jobId: z.ZodOptional<z.ZodString>;
    candidateId: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    sort: string;
    search: string;
    limit: number;
    page: number;
    order: "asc" | "desc";
    status?: string | undefined;
    jobId?: string | undefined;
    candidateId?: string | undefined;
}, {
    sort?: string | undefined;
    status?: string | undefined;
    jobId?: string | undefined;
    candidateId?: string | undefined;
    search?: string | undefined;
    limit?: number | undefined;
    page?: number | undefined;
    order?: "asc" | "desc" | undefined;
}>;
export declare const applicationIdParamSchema: z.ZodObject<{
    id: z.ZodString;
}, "strip", z.ZodTypeAny, {
    id: string;
}, {
    id: string;
}>;
//# sourceMappingURL=application.validation.d.ts.map