"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.changePasswordSchema = exports.userIdParamSchema = exports.userQuerySchema = exports.updateUserSchema = void 0;
const zod_1 = require("zod");
const common_validation_1 = require("./common.validation");
const educationSchema = zod_1.z.object({
    institution: zod_1.z.string().min(1),
    degree: zod_1.z.string().min(1),
    field: zod_1.z.string().min(1),
    startYear: zod_1.z.number().int().min(1950).max(2100),
    endYear: zod_1.z.number().int().min(1950).max(2100).optional(),
    description: zod_1.z.string().optional(),
});
const experienceSchema = zod_1.z.object({
    company: zod_1.z.string().min(1),
    title: zod_1.z.string().min(1),
    startDate: zod_1.z.string().min(1),
    endDate: zod_1.z.string().optional(),
    current: zod_1.z.boolean().default(false),
    description: zod_1.z.string().min(1),
});
exports.updateUserSchema = zod_1.z.object({
    name: zod_1.z.string().min(2).max(100).optional(),
    phone: zod_1.z.string().max(30).optional(),
    bio: zod_1.z.string().max(2000).optional(),
    skills: zod_1.z.array(zod_1.z.string()).optional(),
    experienceYears: zod_1.z.number().min(0).max(60).optional(),
    experience: zod_1.z.array(experienceSchema).optional(),
    education: zod_1.z.array(educationSchema).optional(),
    portfolio: zod_1.z.string().url().optional().or(zod_1.z.literal("")),
    github: zod_1.z.string().url().optional().or(zod_1.z.literal("")),
    linkedin: zod_1.z.string().url().optional().or(zod_1.z.literal("")),
    location: zod_1.z.string().max(200).optional(),
    role: zod_1.z.enum(["admin", "recruiter", "candidate"]).optional(),
    isPremium: zod_1.z.boolean().optional(),
    isVerified: zod_1.z.boolean().optional(),
    notificationPreferences: zod_1.z
        .object({
        email: zod_1.z.boolean(),
        push: zod_1.z.boolean(),
        applicationUpdates: zod_1.z.boolean(),
        interviewUpdates: zod_1.z.boolean(),
        marketing: zod_1.z.boolean(),
    })
        .optional(),
    privacy: zod_1.z
        .object({
        publicProfile: zod_1.z.boolean(),
        hideEmail: zod_1.z.boolean(),
        hidePhone: zod_1.z.boolean(),
    })
        .optional(),
});
exports.userQuerySchema = common_validation_1.paginationSchema.extend({
    role: zod_1.z.enum(["admin", "recruiter", "candidate"]).optional(),
});
exports.userIdParamSchema = zod_1.z.object({
    id: common_validation_1.objectIdSchema,
});
exports.changePasswordSchema = zod_1.z.object({
    currentPassword: zod_1.z.string().min(1),
    newPassword: zod_1.z.string().min(8).max(128),
});
//# sourceMappingURL=user.validation.js.map