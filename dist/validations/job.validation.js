"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.jobIdParamSchema = exports.jobQuerySchema = exports.updateJobSchema = exports.createJobSchema = void 0;
const zod_1 = require("zod");
const common_validation_1 = require("./common.validation");
exports.createJobSchema = zod_1.z.object({
    companyId: common_validation_1.objectIdSchema,
    title: zod_1.z.string().min(3).max(150),
    shortDescription: zod_1.z.string().min(20).max(300),
    description: zod_1.z.string().min(50).max(20000),
    requirements: zod_1.z.array(zod_1.z.string()).min(1),
    responsibilities: zod_1.z.array(zod_1.z.string()).min(1),
    benefits: zod_1.z.array(zod_1.z.string()).default([]),
    skills: zod_1.z.array(zod_1.z.string()).min(1),
    salary: common_validation_1.salarySchema,
    currency: zod_1.z.string().default("USD"),
    experience: zod_1.z.string().min(1),
    category: zod_1.z.string().min(1),
    jobType: zod_1.z.enum(["full-time", "part-time", "contract", "internship", "freelance"]),
    workMode: zod_1.z.enum(["remote", "onsite", "hybrid"]),
    location: zod_1.z.string().min(1),
    vacancies: zod_1.z.number().int().min(1).default(1),
    applicationDeadline: zod_1.z.coerce.date(),
    featured: zod_1.z.boolean().default(false),
    status: zod_1.z.enum(["draft", "active", "closed", "expired"]).default("active"),
});
exports.updateJobSchema = exports.createJobSchema.partial();
exports.jobQuerySchema = common_validation_1.paginationSchema.extend({
    category: zod_1.z.string().optional(),
    location: zod_1.z.string().optional(),
    experience: zod_1.z.string().optional(),
    jobType: zod_1.z.string().optional(),
    workMode: zod_1.z.string().optional(),
    companyId: common_validation_1.objectIdSchema.optional(),
    company: zod_1.z.string().optional(),
    minSalary: zod_1.z.coerce.number().optional(),
    maxSalary: zod_1.z.coerce.number().optional(),
    featured: zod_1.z.coerce.boolean().optional(),
    status: zod_1.z.enum(["draft", "active", "closed", "expired"]).optional(),
    skills: zod_1.z.string().optional(),
});
exports.jobIdParamSchema = zod_1.z.object({
    id: zod_1.z.string().min(1),
});
//# sourceMappingURL=job.validation.js.map