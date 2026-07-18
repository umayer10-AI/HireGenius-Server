"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.blogService = exports.reviewService = exports.BlogService = exports.ReviewService = void 0;
const mongodb_1 = require("mongodb");
const repositories_1 = require("../repositories");
const company_repository_1 = require("../repositories/company.repository");
const errors_1 = require("../utils/errors");
const helpers_1 = require("../utils/helpers");
const response_1 = require("../utils/response");
class ReviewService {
    async create(input, user) {
        if (!user._id)
            throw new errors_1.ForbiddenError("Invalid user");
        await company_repository_1.companyRepository.findByIdOrThrow(input.companyId, "Company not found");
        const existing = await repositories_1.reviewRepository.findExisting(user._id, new mongodb_1.ObjectId(input.companyId));
        if (existing)
            throw new errors_1.ConflictError("You already reviewed this company");
        const now = new Date();
        const review = await repositories_1.reviewRepository.insertOne({
            companyId: new mongodb_1.ObjectId(input.companyId),
            userId: user._id,
            rating: input.rating,
            comment: input.comment,
            createdAt: now,
            updatedAt: now,
        });
        const stats = await repositories_1.reviewRepository.getCompanyStats(new mongodb_1.ObjectId(input.companyId));
        await company_repository_1.companyRepository.updateRating(new mongodb_1.ObjectId(input.companyId), stats.avg, stats.count);
        return review;
    }
    async list(params) {
        const { data, total } = await repositories_1.reviewRepository.list(params);
        return { data, meta: (0, response_1.buildPaginationMeta)(params.page, params.limit, total) };
    }
    async update(id, updates, user) {
        const review = await repositories_1.reviewRepository.findByIdOrThrow(id, "Review not found");
        if (user.role !== "admin" && review.userId.toString() !== user._id?.toString()) {
            throw new errors_1.ForbiddenError("Forbidden");
        }
        const updated = await repositories_1.reviewRepository.updateById(id, {
            $set: { ...updates, updatedAt: new Date() },
        });
        const stats = await repositories_1.reviewRepository.getCompanyStats(review.companyId);
        await company_repository_1.companyRepository.updateRating(review.companyId, stats.avg, stats.count);
        return updated;
    }
    async remove(id, user) {
        const review = await repositories_1.reviewRepository.findByIdOrThrow(id, "Review not found");
        if (user.role !== "admin" && review.userId.toString() !== user._id?.toString()) {
            throw new errors_1.ForbiddenError("Forbidden");
        }
        await repositories_1.reviewRepository.deleteById(id);
        const stats = await repositories_1.reviewRepository.getCompanyStats(review.companyId);
        await company_repository_1.companyRepository.updateRating(review.companyId, stats.avg, stats.count);
        return { deleted: true };
    }
}
exports.ReviewService = ReviewService;
class BlogService {
    async create(data, user) {
        const now = new Date();
        return repositories_1.blogRepository.insertOne({
            ...data,
            slug: (0, helpers_1.uniqueSlug)(data.title),
            authorId: user._id,
            createdAt: now,
            updatedAt: now,
        });
    }
    async list(params) {
        const query = {
            ...params,
            published: params.published ?? true,
        };
        const { data, total } = await repositories_1.blogRepository.list(query);
        return { data, meta: (0, response_1.buildPaginationMeta)(params.page, params.limit, total) };
    }
    async getBySlug(slug) {
        const blog = await repositories_1.blogRepository.findBySlug(slug);
        if (!blog) {
            const { NotFoundError } = await Promise.resolve().then(() => __importStar(require("../utils/errors")));
            throw new NotFoundError("Blog not found");
        }
        return blog;
    }
    async getById(id) {
        return repositories_1.blogRepository.findByIdOrThrow(id, "Blog not found");
    }
    async update(id, updates, user) {
        if (user.role !== "admin")
            throw new errors_1.ForbiddenError("Admin only");
        if (updates.title)
            updates.slug = (0, helpers_1.uniqueSlug)(updates.title);
        return repositories_1.blogRepository.updateById(id, {
            $set: { ...updates, updatedAt: new Date() },
        });
    }
    async remove(id, user) {
        if (user.role !== "admin")
            throw new errors_1.ForbiddenError("Admin only");
        await repositories_1.blogRepository.deleteById(id);
        return { deleted: true };
    }
}
exports.BlogService = BlogService;
exports.reviewService = new ReviewService();
exports.blogService = new BlogService();
//# sourceMappingURL=review.service.js.map