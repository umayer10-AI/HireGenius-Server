import { z } from "zod";
export declare const registerSchema: z.ZodObject<{
    name: z.ZodString;
    email: z.ZodString;
    password: z.ZodString;
    role: z.ZodDefault<z.ZodEnum<["candidate", "recruiter"]>>;
}, "strip", z.ZodTypeAny, {
    email: string;
    role: "recruiter" | "candidate";
    name: string;
    password: string;
}, {
    email: string;
    name: string;
    password: string;
    role?: "recruiter" | "candidate" | undefined;
}>;
export declare const loginSchema: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
}, "strip", z.ZodTypeAny, {
    email: string;
    password: string;
}, {
    email: string;
    password: string;
}>;
//# sourceMappingURL=auth.validation.d.ts.map