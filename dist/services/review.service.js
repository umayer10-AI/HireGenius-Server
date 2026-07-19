import { ObjectId } from "mongodb";
import { blogRepository, reviewRepository } from "../repositories/index.js";
import { companyRepository } from "../repositories/company.repository.js";
import { ConflictError, ForbiddenError } from "../utils/errors.js";
import { uniqueSlug } from "../utils/helpers.js";
import { buildPaginationMeta } from "../utils/response.js";
export class ReviewService {
    async create(input, user) {
        if (!user._id)
            throw new ForbiddenError("Invalid user");
        await companyRepository.findByIdOrThrow(input.companyId, "Company not found");
        const existing = await reviewRepository.findExisting(user._id, new ObjectId(input.companyId));
        if (existing)
            throw new ConflictError("You already reviewed this company");
        const now = new Date();
        const review = await reviewRepository.insertOne({
            companyId: new ObjectId(input.companyId),
            userId: user._id,
            rating: input.rating,
            comment: input.comment,
            createdAt: now,
            updatedAt: now,
        });
        const stats = await reviewRepository.getCompanyStats(new ObjectId(input.companyId));
        await companyRepository.updateRating(new ObjectId(input.companyId), stats.avg, stats.count);
        return review;
    }
    async list(params) {
        const { data, total } = await reviewRepository.list(params);
        return { data, meta: buildPaginationMeta(params.page, params.limit, total) };
    }
    async update(id, updates, user) {
        const review = await reviewRepository.findByIdOrThrow(id, "Review not found");
        if (user.role !== "admin" && review.userId.toString() !== user._id?.toString()) {
            throw new ForbiddenError("Forbidden");
        }
        const updated = await reviewRepository.updateById(id, {
            $set: { ...updates, updatedAt: new Date() },
        });
        const stats = await reviewRepository.getCompanyStats(review.companyId);
        await companyRepository.updateRating(review.companyId, stats.avg, stats.count);
        return updated;
    }
    async remove(id, user) {
        const review = await reviewRepository.findByIdOrThrow(id, "Review not found");
        if (user.role !== "admin" && review.userId.toString() !== user._id?.toString()) {
            throw new ForbiddenError("Forbidden");
        }
        await reviewRepository.deleteById(id);
        const stats = await reviewRepository.getCompanyStats(review.companyId);
        await companyRepository.updateRating(review.companyId, stats.avg, stats.count);
        return { deleted: true };
    }
}
export class BlogService {
    async create(data, user) {
        const now = new Date();
        return blogRepository.insertOne({
            ...data,
            slug: uniqueSlug(data.title),
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
        const { data, total } = await blogRepository.list(query);
        return { data, meta: buildPaginationMeta(params.page, params.limit, total) };
    }
    async getBySlug(slug) {
        const blog = await blogRepository.findBySlug(slug);
        if (!blog) {
            const { NotFoundError } = await import("../utils/errors.js");
            throw new NotFoundError("Blog not found");
        }
        return blog;
    }
    async getById(id) {
        return blogRepository.findByIdOrThrow(id, "Blog not found");
    }
    async update(id, updates, user) {
        if (user.role !== "admin")
            throw new ForbiddenError("Admin only");
        if (updates.title)
            updates.slug = uniqueSlug(updates.title);
        return blogRepository.updateById(id, {
            $set: { ...updates, updatedAt: new Date() },
        });
    }
    async remove(id, user) {
        if (user.role !== "admin")
            throw new ForbiddenError("Admin only");
        await blogRepository.deleteById(id);
        return { deleted: true };
    }
}
export const reviewService = new ReviewService();
export const blogService = new BlogService();
//# sourceMappingURL=review.service.js.map