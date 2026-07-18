export declare function slugify(text: string): string;
export declare function uniqueSlug(text: string): string;
export declare function sanitizeString(value: string): string;
export declare function parsePositiveInt(value: unknown, fallback: number): number;
export declare function clamp(value: number, min: number, max: number): number;
export declare function omitPassword<T extends {
    password?: string;
}>(user: T): Omit<T, "password">;
export declare function calculateProfileCompletion(user: {
    name?: string;
    email?: string;
    phone?: string;
    bio?: string;
    image?: string;
    skills?: string[];
    experience?: unknown[];
    education?: unknown[];
    resume?: string;
    portfolio?: string;
    github?: string;
    linkedin?: string;
    location?: string;
}): {
    percentage: number;
    missing: string[];
};
//# sourceMappingURL=helpers.d.ts.map