import { z } from "zod";
export declare const paginationSchema: z.ZodObject<{
    page: z.ZodDefault<z.ZodNumber>;
    limit: z.ZodDefault<z.ZodNumber>;
    search: z.ZodDefault<z.ZodOptional<z.ZodString>>;
    sort: z.ZodDefault<z.ZodOptional<z.ZodString>>;
    order: z.ZodDefault<z.ZodOptional<z.ZodEnum<["asc", "desc"]>>>;
}, "strip", z.ZodTypeAny, {
    sort: string;
    search: string;
    limit: number;
    page: number;
    order: "asc" | "desc";
}, {
    sort?: string | undefined;
    search?: string | undefined;
    limit?: number | undefined;
    page?: number | undefined;
    order?: "asc" | "desc" | undefined;
}>;
export declare const objectIdSchema: z.ZodString;
export declare const salarySchema: z.ZodObject<{
    min: z.ZodNumber;
    max: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    min: number;
    max: number;
}, {
    min: number;
    max: number;
}>;
//# sourceMappingURL=common.validation.d.ts.map