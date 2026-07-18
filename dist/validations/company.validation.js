"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.companyIdParamSchema = exports.companyQuerySchema = exports.updateCompanySchema = exports.createCompanySchema = void 0;
const zod_1 = require("zod");
const common_validation_1 = require("./common.validation");
exports.createCompanySchema = zod_1.z.object({
    companyName: zod_1.z.string().min(2).max(150),
    website: zod_1.z.string().url().optional().or(zod_1.z.literal("")),
    industry: zod_1.z.string().min(2).max(100),
    companySize: zod_1.z.string().min(1),
    description: zod_1.z.string().min(20).max(5000),
    location: zod_1.z.string().min(2).max(200),
    email: zod_1.z.string().email().optional(),
    phone: zod_1.z.string().max(30).optional(),
    socialLinks: zod_1.z
        .object({
        linkedin: zod_1.z.string().url().optional().or(zod_1.z.literal("")),
        twitter: zod_1.z.string().url().optional().or(zod_1.z.literal("")),
        facebook: zod_1.z.string().url().optional().or(zod_1.z.literal("")),
        github: zod_1.z.string().url().optional().or(zod_1.z.literal("")),
        website: zod_1.z.string().url().optional().or(zod_1.z.literal("")),
    })
        .optional(),
});
exports.updateCompanySchema = exports.createCompanySchema.partial();
exports.companyQuerySchema = common_validation_1.paginationSchema.extend({
    industry: zod_1.z.string().optional(),
    location: zod_1.z.string().optional(),
});
exports.companyIdParamSchema = zod_1.z.object({
    id: common_validation_1.objectIdSchema,
});
//# sourceMappingURL=company.validation.js.map