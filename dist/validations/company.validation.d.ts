import { z } from "zod";
export declare const createCompanySchema: z.ZodObject<{
    companyName: z.ZodString;
    website: z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>;
    industry: z.ZodString;
    companySize: z.ZodString;
    description: z.ZodString;
    location: z.ZodString;
    email: z.ZodOptional<z.ZodString>;
    phone: z.ZodOptional<z.ZodString>;
    socialLinks: z.ZodOptional<z.ZodObject<{
        linkedin: z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>;
        twitter: z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>;
        facebook: z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>;
        github: z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>;
        website: z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>;
    }, "strip", z.ZodTypeAny, {
        github?: string | undefined;
        facebook?: string | undefined;
        twitter?: string | undefined;
        linkedin?: string | undefined;
        website?: string | undefined;
    }, {
        github?: string | undefined;
        facebook?: string | undefined;
        twitter?: string | undefined;
        linkedin?: string | undefined;
        website?: string | undefined;
    }>>;
}, "strip", z.ZodTypeAny, {
    companyName: string;
    industry: string;
    location: string;
    companySize: string;
    description: string;
    email?: string | undefined;
    phone?: string | undefined;
    website?: string | undefined;
    socialLinks?: {
        github?: string | undefined;
        facebook?: string | undefined;
        twitter?: string | undefined;
        linkedin?: string | undefined;
        website?: string | undefined;
    } | undefined;
}, {
    companyName: string;
    industry: string;
    location: string;
    companySize: string;
    description: string;
    email?: string | undefined;
    phone?: string | undefined;
    website?: string | undefined;
    socialLinks?: {
        github?: string | undefined;
        facebook?: string | undefined;
        twitter?: string | undefined;
        linkedin?: string | undefined;
        website?: string | undefined;
    } | undefined;
}>;
export declare const updateCompanySchema: z.ZodObject<{
    companyName: z.ZodOptional<z.ZodString>;
    website: z.ZodOptional<z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>>;
    industry: z.ZodOptional<z.ZodString>;
    companySize: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodString>;
    location: z.ZodOptional<z.ZodString>;
    email: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    phone: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    socialLinks: z.ZodOptional<z.ZodOptional<z.ZodObject<{
        linkedin: z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>;
        twitter: z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>;
        facebook: z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>;
        github: z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>;
        website: z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>;
    }, "strip", z.ZodTypeAny, {
        github?: string | undefined;
        facebook?: string | undefined;
        twitter?: string | undefined;
        linkedin?: string | undefined;
        website?: string | undefined;
    }, {
        github?: string | undefined;
        facebook?: string | undefined;
        twitter?: string | undefined;
        linkedin?: string | undefined;
        website?: string | undefined;
    }>>>;
}, "strip", z.ZodTypeAny, {
    email?: string | undefined;
    companyName?: string | undefined;
    industry?: string | undefined;
    location?: string | undefined;
    phone?: string | undefined;
    website?: string | undefined;
    companySize?: string | undefined;
    description?: string | undefined;
    socialLinks?: {
        github?: string | undefined;
        facebook?: string | undefined;
        twitter?: string | undefined;
        linkedin?: string | undefined;
        website?: string | undefined;
    } | undefined;
}, {
    email?: string | undefined;
    companyName?: string | undefined;
    industry?: string | undefined;
    location?: string | undefined;
    phone?: string | undefined;
    website?: string | undefined;
    companySize?: string | undefined;
    description?: string | undefined;
    socialLinks?: {
        github?: string | undefined;
        facebook?: string | undefined;
        twitter?: string | undefined;
        linkedin?: string | undefined;
        website?: string | undefined;
    } | undefined;
}>;
export declare const companyQuerySchema: z.ZodObject<{
    page: z.ZodDefault<z.ZodNumber>;
    limit: z.ZodDefault<z.ZodNumber>;
    search: z.ZodDefault<z.ZodOptional<z.ZodString>>;
    sort: z.ZodDefault<z.ZodOptional<z.ZodString>>;
    order: z.ZodDefault<z.ZodOptional<z.ZodEnum<["asc", "desc"]>>>;
} & {
    industry: z.ZodOptional<z.ZodString>;
    location: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    sort: string;
    search: string;
    limit: number;
    page: number;
    order: "asc" | "desc";
    industry?: string | undefined;
    location?: string | undefined;
}, {
    sort?: string | undefined;
    industry?: string | undefined;
    location?: string | undefined;
    search?: string | undefined;
    limit?: number | undefined;
    page?: number | undefined;
    order?: "asc" | "desc" | undefined;
}>;
export declare const companyIdParamSchema: z.ZodObject<{
    id: z.ZodString;
}, "strip", z.ZodTypeAny, {
    id: string;
}, {
    id: string;
}>;
//# sourceMappingURL=company.validation.d.ts.map