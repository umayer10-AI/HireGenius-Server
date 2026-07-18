"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reviewIdParamSchema = exports.reviewQuerySchema = exports.updateReviewSchema = exports.createReviewSchema = void 0;
const zod_1 = require("zod");
const common_validation_1 = require("./common.validation");
exports.createReviewSchema = zod_1.z.object({
    companyId: common_validation_1.objectIdSchema,
    rating: zod_1.z.number().min(1).max(5),
    comment: zod_1.z.string().min(10).max(2000),
});
exports.updateReviewSchema = zod_1.z.object({
    rating: zod_1.z.number().min(1).max(5).optional(),
    comment: zod_1.z.string().min(10).max(2000).optional(),
});
exports.reviewQuerySchema = common_validation_1.paginationSchema.extend({
    companyId: common_validation_1.objectIdSchema.optional(),
});
exports.reviewIdParamSchema = zod_1.z.object({
    id: common_validation_1.objectIdSchema,
});
//# sourceMappingURL=review.validation.js.map