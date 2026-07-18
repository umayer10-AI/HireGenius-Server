import { z } from "zod";
export declare const createJobSchema: z.ZodObject<{
    companyId: z.ZodString;
    title: z.ZodString;
    shortDescription: z.ZodString;
    description: z.ZodString;
    requirements: z.ZodArray<z.ZodString, "many">;
    responsibilities: z.ZodArray<z.ZodString, "many">;
    benefits: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    skills: z.ZodArray<z.ZodString, "many">;
    salary: z.ZodObject<{
        min: z.ZodNumber;
        max: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        min: number;
        max: number;
    }, {
        min: number;
        max: number;
    }>;
    currency: z.ZodDefault<z.ZodString>;
    experience: z.ZodString;
    category: z.ZodString;
    jobType: z.ZodEnum<["full-time", "part-time", "contract", "internship", "freelance"]>;
    workMode: z.ZodEnum<["remote", "onsite", "hybrid"]>;
    location: z.ZodString;
    vacancies: z.ZodDefault<z.ZodNumber>;
    applicationDeadline: z.ZodDate;
    featured: z.ZodDefault<z.ZodBoolean>;
    status: z.ZodDefault<z.ZodEnum<["draft", "active", "closed", "expired"]>>;
}, "strip", z.ZodTypeAny, {
    status: "closed" | "draft" | "active" | "expired";
    location: string;
    title: string;
    shortDescription: string;
    skills: string[];
    companyId: string;
    category: string;
    salary: {
        min: number;
        max: number;
    };
    applicationDeadline: Date;
    featured: boolean;
    experience: string;
    description: string;
    requirements: string[];
    responsibilities: string[];
    benefits: string[];
    currency: string;
    jobType: "full-time" | "part-time" | "contract" | "internship" | "freelance";
    workMode: "remote" | "onsite" | "hybrid";
    vacancies: number;
}, {
    location: string;
    title: string;
    shortDescription: string;
    skills: string[];
    companyId: string;
    category: string;
    salary: {
        min: number;
        max: number;
    };
    applicationDeadline: Date;
    experience: string;
    description: string;
    requirements: string[];
    responsibilities: string[];
    jobType: "full-time" | "part-time" | "contract" | "internship" | "freelance";
    workMode: "remote" | "onsite" | "hybrid";
    status?: "closed" | "draft" | "active" | "expired" | undefined;
    featured?: boolean | undefined;
    benefits?: string[] | undefined;
    currency?: string | undefined;
    vacancies?: number | undefined;
}>;
export declare const updateJobSchema: z.ZodObject<{
    companyId: z.ZodOptional<z.ZodString>;
    title: z.ZodOptional<z.ZodString>;
    shortDescription: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodString>;
    requirements: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    responsibilities: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    benefits: z.ZodOptional<z.ZodDefault<z.ZodArray<z.ZodString, "many">>>;
    skills: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    salary: z.ZodOptional<z.ZodObject<{
        min: z.ZodNumber;
        max: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        min: number;
        max: number;
    }, {
        min: number;
        max: number;
    }>>;
    currency: z.ZodOptional<z.ZodDefault<z.ZodString>>;
    experience: z.ZodOptional<z.ZodString>;
    category: z.ZodOptional<z.ZodString>;
    jobType: z.ZodOptional<z.ZodEnum<["full-time", "part-time", "contract", "internship", "freelance"]>>;
    workMode: z.ZodOptional<z.ZodEnum<["remote", "onsite", "hybrid"]>>;
    location: z.ZodOptional<z.ZodString>;
    vacancies: z.ZodOptional<z.ZodDefault<z.ZodNumber>>;
    applicationDeadline: z.ZodOptional<z.ZodDate>;
    featured: z.ZodOptional<z.ZodDefault<z.ZodBoolean>>;
    status: z.ZodOptional<z.ZodDefault<z.ZodEnum<["draft", "active", "closed", "expired"]>>>;
}, "strip", z.ZodTypeAny, {
    status?: "closed" | "draft" | "active" | "expired" | undefined;
    location?: string | undefined;
    title?: string | undefined;
    shortDescription?: string | undefined;
    skills?: string[] | undefined;
    companyId?: string | undefined;
    category?: string | undefined;
    salary?: {
        min: number;
        max: number;
    } | undefined;
    applicationDeadline?: Date | undefined;
    featured?: boolean | undefined;
    experience?: string | undefined;
    description?: string | undefined;
    requirements?: string[] | undefined;
    responsibilities?: string[] | undefined;
    benefits?: string[] | undefined;
    currency?: string | undefined;
    jobType?: "full-time" | "part-time" | "contract" | "internship" | "freelance" | undefined;
    workMode?: "remote" | "onsite" | "hybrid" | undefined;
    vacancies?: number | undefined;
}, {
    status?: "closed" | "draft" | "active" | "expired" | undefined;
    location?: string | undefined;
    title?: string | undefined;
    shortDescription?: string | undefined;
    skills?: string[] | undefined;
    companyId?: string | undefined;
    category?: string | undefined;
    salary?: {
        min: number;
        max: number;
    } | undefined;
    applicationDeadline?: Date | undefined;
    featured?: boolean | undefined;
    experience?: string | undefined;
    description?: string | undefined;
    requirements?: string[] | undefined;
    responsibilities?: string[] | undefined;
    benefits?: string[] | undefined;
    currency?: string | undefined;
    jobType?: "full-time" | "part-time" | "contract" | "internship" | "freelance" | undefined;
    workMode?: "remote" | "onsite" | "hybrid" | undefined;
    vacancies?: number | undefined;
}>;
export declare const jobQuerySchema: z.ZodObject<{
    page: z.ZodDefault<z.ZodNumber>;
    limit: z.ZodDefault<z.ZodNumber>;
    search: z.ZodDefault<z.ZodOptional<z.ZodString>>;
    sort: z.ZodDefault<z.ZodOptional<z.ZodString>>;
    order: z.ZodDefault<z.ZodOptional<z.ZodEnum<["asc", "desc"]>>>;
} & {
    category: z.ZodOptional<z.ZodString>;
    location: z.ZodOptional<z.ZodString>;
    experience: z.ZodOptional<z.ZodString>;
    jobType: z.ZodOptional<z.ZodString>;
    workMode: z.ZodOptional<z.ZodString>;
    companyId: z.ZodOptional<z.ZodString>;
    company: z.ZodOptional<z.ZodString>;
    minSalary: z.ZodOptional<z.ZodNumber>;
    maxSalary: z.ZodOptional<z.ZodNumber>;
    featured: z.ZodOptional<z.ZodBoolean>;
    status: z.ZodOptional<z.ZodEnum<["draft", "active", "closed", "expired"]>>;
    skills: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    sort: string;
    search: string;
    limit: number;
    page: number;
    order: "asc" | "desc";
    status?: "closed" | "draft" | "active" | "expired" | undefined;
    location?: string | undefined;
    skills?: string | undefined;
    companyId?: string | undefined;
    category?: string | undefined;
    featured?: boolean | undefined;
    experience?: string | undefined;
    jobType?: string | undefined;
    workMode?: string | undefined;
    company?: string | undefined;
    minSalary?: number | undefined;
    maxSalary?: number | undefined;
}, {
    sort?: string | undefined;
    status?: "closed" | "draft" | "active" | "expired" | undefined;
    location?: string | undefined;
    skills?: string | undefined;
    companyId?: string | undefined;
    category?: string | undefined;
    featured?: boolean | undefined;
    search?: string | undefined;
    experience?: string | undefined;
    jobType?: string | undefined;
    workMode?: string | undefined;
    company?: string | undefined;
    limit?: number | undefined;
    page?: number | undefined;
    order?: "asc" | "desc" | undefined;
    minSalary?: number | undefined;
    maxSalary?: number | undefined;
}>;
export declare const jobIdParamSchema: z.ZodObject<{
    id: z.ZodString;
}, "strip", z.ZodTypeAny, {
    id: string;
}, {
    id: string;
}>;
//# sourceMappingURL=job.validation.d.ts.map