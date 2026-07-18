import { z } from "zod";
export declare const createBlogSchema: z.ZodObject<{
    title: z.ZodString;
    description: z.ZodString;
    content: z.ZodString;
    image: z.ZodOptional<z.ZodString>;
    author: z.ZodString;
    tags: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    published: z.ZodDefault<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    title: string;
    tags: string[];
    published: boolean;
    description: string;
    content: string;
    author: string;
    image?: string | undefined;
}, {
    title: string;
    description: string;
    content: string;
    author: string;
    tags?: string[] | undefined;
    published?: boolean | undefined;
    image?: string | undefined;
}>;
export declare const updateBlogSchema: z.ZodObject<{
    title: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodString>;
    content: z.ZodOptional<z.ZodString>;
    image: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    author: z.ZodOptional<z.ZodString>;
    tags: z.ZodOptional<z.ZodDefault<z.ZodArray<z.ZodString, "many">>>;
    published: z.ZodOptional<z.ZodDefault<z.ZodBoolean>>;
}, "strip", z.ZodTypeAny, {
    title?: string | undefined;
    tags?: string[] | undefined;
    published?: boolean | undefined;
    image?: string | undefined;
    description?: string | undefined;
    content?: string | undefined;
    author?: string | undefined;
}, {
    title?: string | undefined;
    tags?: string[] | undefined;
    published?: boolean | undefined;
    image?: string | undefined;
    description?: string | undefined;
    content?: string | undefined;
    author?: string | undefined;
}>;
export declare const blogQuerySchema: z.ZodObject<{
    page: z.ZodDefault<z.ZodNumber>;
    limit: z.ZodDefault<z.ZodNumber>;
    search: z.ZodDefault<z.ZodOptional<z.ZodString>>;
    sort: z.ZodDefault<z.ZodOptional<z.ZodString>>;
    order: z.ZodDefault<z.ZodOptional<z.ZodEnum<["asc", "desc"]>>>;
} & {
    tag: z.ZodOptional<z.ZodString>;
    published: z.ZodOptional<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    sort: string;
    search: string;
    limit: number;
    page: number;
    order: "asc" | "desc";
    published?: boolean | undefined;
    tag?: string | undefined;
}, {
    sort?: string | undefined;
    published?: boolean | undefined;
    search?: string | undefined;
    limit?: number | undefined;
    page?: number | undefined;
    order?: "asc" | "desc" | undefined;
    tag?: string | undefined;
}>;
export declare const blogIdParamSchema: z.ZodObject<{
    id: z.ZodString;
}, "strip", z.ZodTypeAny, {
    id: string;
}, {
    id: string;
}>;
export declare const blogSlugParamSchema: z.ZodObject<{
    slug: z.ZodString;
}, "strip", z.ZodTypeAny, {
    slug: string;
}, {
    slug: string;
}>;
//# sourceMappingURL=blog.validation.d.ts.map