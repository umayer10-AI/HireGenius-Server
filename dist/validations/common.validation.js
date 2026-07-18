"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.salarySchema = exports.objectIdSchema = exports.paginationSchema = void 0;
const zod_1 = require("zod");
exports.paginationSchema = zod_1.z.object({
    page: zod_1.z.coerce.number().int().min(1).default(1),
    limit: zod_1.z.coerce.number().int().min(1).max(100).default(12),
    search: zod_1.z.string().optional().default(""),
    sort: zod_1.z.string().optional().default("newest"),
    order: zod_1.z.enum(["asc", "desc"]).optional().default("desc"),
});
exports.objectIdSchema = zod_1.z.string().regex(/^[a-f\d]{24}$/i, "Invalid ID");
exports.salarySchema = zod_1.z.object({
    min: zod_1.z.number().min(0),
    max: zod_1.z.number().min(0),
});
//# sourceMappingURL=common.validation.js.map