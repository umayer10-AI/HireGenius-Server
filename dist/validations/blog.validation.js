"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.blogSlugParamSchema = exports.blogIdParamSchema = exports.blogQuerySchema = exports.updateBlogSchema = exports.createBlogSchema = void 0;
const zod_1 = require("zod");
const common_validation_1 = require("./common.validation");
exports.createBlogSchema = zod_1.z.object({
    title: zod_1.z.string().min(5).max(200),
    description: zod_1.z.string().min(20).max(500),
    content: zod_1.z.string().min(50),
    image: zod_1.z.string().url().optional(),
    author: zod_1.z.string().min(2),
    tags: zod_1.z.array(zod_1.z.string()).default([]),
    published: zod_1.z.boolean().default(true),
});
exports.updateBlogSchema = exports.createBlogSchema.partial();
exports.blogQuerySchema = common_validation_1.paginationSchema.extend({
    tag: zod_1.z.string().optional(),
    published: zod_1.z.coerce.boolean().optional(),
});
exports.blogIdParamSchema = zod_1.z.object({
    id: common_validation_1.objectIdSchema,
});
exports.blogSlugParamSchema = zod_1.z.object({
    slug: zod_1.z.string().min(1),
});
//# sourceMappingURL=blog.validation.js.map