import { z } from "zod";
export declare const updateUserSchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    phone: z.ZodOptional<z.ZodString>;
    bio: z.ZodOptional<z.ZodString>;
    skills: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    experienceYears: z.ZodOptional<z.ZodNumber>;
    experience: z.ZodOptional<z.ZodArray<z.ZodObject<{
        company: z.ZodString;
        title: z.ZodString;
        startDate: z.ZodString;
        endDate: z.ZodOptional<z.ZodString>;
        current: z.ZodDefault<z.ZodBoolean>;
        description: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        title: string;
        description: string;
        company: string;
        startDate: string;
        current: boolean;
        endDate?: string | undefined;
    }, {
        title: string;
        description: string;
        company: string;
        startDate: string;
        endDate?: string | undefined;
        current?: boolean | undefined;
    }>, "many">>;
    education: z.ZodOptional<z.ZodArray<z.ZodObject<{
        institution: z.ZodString;
        degree: z.ZodString;
        field: z.ZodString;
        startYear: z.ZodNumber;
        endYear: z.ZodOptional<z.ZodNumber>;
        description: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        institution: string;
        degree: string;
        field: string;
        startYear: number;
        description?: string | undefined;
        endYear?: number | undefined;
    }, {
        institution: string;
        degree: string;
        field: string;
        startYear: number;
        description?: string | undefined;
        endYear?: number | undefined;
    }>, "many">>;
    portfolio: z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>;
    github: z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>;
    linkedin: z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>;
    location: z.ZodOptional<z.ZodString>;
    role: z.ZodOptional<z.ZodEnum<["admin", "recruiter", "candidate"]>>;
    isPremium: z.ZodOptional<z.ZodBoolean>;
    isVerified: z.ZodOptional<z.ZodBoolean>;
    notificationPreferences: z.ZodOptional<z.ZodObject<{
        email: z.ZodBoolean;
        push: z.ZodBoolean;
        applicationUpdates: z.ZodBoolean;
        interviewUpdates: z.ZodBoolean;
        marketing: z.ZodBoolean;
    }, "strip", z.ZodTypeAny, {
        push: boolean;
        email: boolean;
        applicationUpdates: boolean;
        interviewUpdates: boolean;
        marketing: boolean;
    }, {
        push: boolean;
        email: boolean;
        applicationUpdates: boolean;
        interviewUpdates: boolean;
        marketing: boolean;
    }>>;
    privacy: z.ZodOptional<z.ZodObject<{
        publicProfile: z.ZodBoolean;
        hideEmail: z.ZodBoolean;
        hidePhone: z.ZodBoolean;
    }, "strip", z.ZodTypeAny, {
        publicProfile: boolean;
        hideEmail: boolean;
        hidePhone: boolean;
    }, {
        publicProfile: boolean;
        hideEmail: boolean;
        hidePhone: boolean;
    }>>;
}, "strip", z.ZodTypeAny, {
    role?: "admin" | "recruiter" | "candidate" | undefined;
    location?: string | undefined;
    skills?: string[] | undefined;
    github?: string | undefined;
    linkedin?: string | undefined;
    name?: string | undefined;
    phone?: string | undefined;
    bio?: string | undefined;
    experienceYears?: number | undefined;
    experience?: {
        title: string;
        description: string;
        company: string;
        startDate: string;
        current: boolean;
        endDate?: string | undefined;
    }[] | undefined;
    education?: {
        institution: string;
        degree: string;
        field: string;
        startYear: number;
        description?: string | undefined;
        endYear?: number | undefined;
    }[] | undefined;
    portfolio?: string | undefined;
    isVerified?: boolean | undefined;
    isPremium?: boolean | undefined;
    notificationPreferences?: {
        push: boolean;
        email: boolean;
        applicationUpdates: boolean;
        interviewUpdates: boolean;
        marketing: boolean;
    } | undefined;
    privacy?: {
        publicProfile: boolean;
        hideEmail: boolean;
        hidePhone: boolean;
    } | undefined;
}, {
    role?: "admin" | "recruiter" | "candidate" | undefined;
    location?: string | undefined;
    skills?: string[] | undefined;
    github?: string | undefined;
    linkedin?: string | undefined;
    name?: string | undefined;
    phone?: string | undefined;
    bio?: string | undefined;
    experienceYears?: number | undefined;
    experience?: {
        title: string;
        description: string;
        company: string;
        startDate: string;
        endDate?: string | undefined;
        current?: boolean | undefined;
    }[] | undefined;
    education?: {
        institution: string;
        degree: string;
        field: string;
        startYear: number;
        description?: string | undefined;
        endYear?: number | undefined;
    }[] | undefined;
    portfolio?: string | undefined;
    isVerified?: boolean | undefined;
    isPremium?: boolean | undefined;
    notificationPreferences?: {
        push: boolean;
        email: boolean;
        applicationUpdates: boolean;
        interviewUpdates: boolean;
        marketing: boolean;
    } | undefined;
    privacy?: {
        publicProfile: boolean;
        hideEmail: boolean;
        hidePhone: boolean;
    } | undefined;
}>;
export declare const userQuerySchema: z.ZodObject<{
    page: z.ZodDefault<z.ZodNumber>;
    limit: z.ZodDefault<z.ZodNumber>;
    search: z.ZodDefault<z.ZodOptional<z.ZodString>>;
    sort: z.ZodDefault<z.ZodOptional<z.ZodString>>;
    order: z.ZodDefault<z.ZodOptional<z.ZodEnum<["asc", "desc"]>>>;
} & {
    role: z.ZodOptional<z.ZodEnum<["admin", "recruiter", "candidate"]>>;
}, "strip", z.ZodTypeAny, {
    sort: string;
    search: string;
    limit: number;
    page: number;
    order: "asc" | "desc";
    role?: "admin" | "recruiter" | "candidate" | undefined;
}, {
    sort?: string | undefined;
    role?: "admin" | "recruiter" | "candidate" | undefined;
    search?: string | undefined;
    limit?: number | undefined;
    page?: number | undefined;
    order?: "asc" | "desc" | undefined;
}>;
export declare const userIdParamSchema: z.ZodObject<{
    id: z.ZodString;
}, "strip", z.ZodTypeAny, {
    id: string;
}, {
    id: string;
}>;
export declare const changePasswordSchema: z.ZodObject<{
    currentPassword: z.ZodString;
    newPassword: z.ZodString;
}, "strip", z.ZodTypeAny, {
    currentPassword: string;
    newPassword: string;
}, {
    currentPassword: string;
    newPassword: string;
}>;
//# sourceMappingURL=user.validation.d.ts.map