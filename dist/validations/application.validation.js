"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.applicationIdParamSchema = exports.applicationQuerySchema = exports.updateApplicationSchema = exports.createApplicationSchema = void 0;
const zod_1 = require("zod");
const common_validation_1 = require("./common.validation");
exports.createApplicationSchema = zod_1.z.object({
    jobId: common_validation_1.objectIdSchema,
    resume: zod_1.z.string().url().optional(),
    coverLetter: zod_1.z.string().max(10000).optional(),
    expectedSalary: zod_1.z.number().min(0).optional(),
    portfolio: zod_1.z.string().url().optional().or(zod_1.z.literal("")),
    github: zod_1.z.string().url().optional().or(zod_1.z.literal("")),
    linkedin: zod_1.z.string().url().optional().or(zod_1.z.literal("")),
});
exports.updateApplicationSchema = zod_1.z.object({
    status: zod_1.z
        .enum([
        "Applied",
        "Reviewed",
        "Shortlisted",
        "Interview Scheduled",
        "Accepted",
        "Rejected",
    ])
        .optional(),
    notes: zod_1.z.string().max(5000).optional(),
    coverLetter: zod_1.z.string().max(10000).optional(),
    expectedSalary: zod_1.z.number().min(0).optional(),
});
exports.applicationQuerySchema = common_validation_1.paginationSchema.extend({
    status: zod_1.z.string().optional(),
    jobId: common_validation_1.objectIdSchema.optional(),
    candidateId: common_validation_1.objectIdSchema.optional(),
});
exports.applicationIdParamSchema = zod_1.z.object({
    id: common_validation_1.objectIdSchema,
});
//# sourceMappingURL=application.validation.js.map