import { ObjectId } from "mongodb";
import { blogRepository, reviewRepository } from "../repositories";
import { companyRepository } from "../repositories/company.repository";
import type { BlogDocument, ReviewDocument, UserDocument } from "../interfaces/models";
import { ConflictError, ForbiddenError } from "../utils/errors";
import { uniqueSlug } from "../utils/helpers";
import { buildPaginationMeta } from "../utils/response";

export class ReviewService {
  async create(
    input: { companyId: string; rating: number; comment: string },
    user: UserDocument
  ) {
    if (!user._id) throw new ForbiddenError("Invalid user");
    await companyRepository.findByIdOrThrow(input.companyId, "Company not found");
    const existing = await reviewRepository.findExisting(
      user._id,
      new ObjectId(input.companyId)
    );
    if (existing) throw new ConflictError("You already reviewed this company");

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
    await companyRepository.updateRating(
      new ObjectId(input.companyId),
      stats.avg,
      stats.count
    );
    return review;
  }

  async list(params: { page: number; limit: number; companyId?: string }) {
    const { data, total } = await reviewRepository.list(params);
    return { data, meta: buildPaginationMeta(params.page, params.limit, total) };
  }

  async update(
    id: string,
    updates: Partial<Pick<ReviewDocument, "rating" | "comment">>,
    user: UserDocument
  ) {
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

  async remove(id: string, user: UserDocument) {
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
  async create(
    data: Omit<BlogDocument, "_id" | "slug" | "createdAt" | "updatedAt" | "authorId">,
    user: UserDocument
  ) {
    const now = new Date();
    return blogRepository.insertOne({
      ...data,
      slug: uniqueSlug(data.title),
      authorId: user._id,
      createdAt: now,
      updatedAt: now,
    });
  }

  async list(params: {
    page: number;
    limit: number;
    search?: string;
    tag?: string;
    published?: boolean;
    sort?: string;
  }) {
    const query = {
      ...params,
      published: params.published ?? true,
    };
    const { data, total } = await blogRepository.list(query);
    return { data, meta: buildPaginationMeta(params.page, params.limit, total) };
  }

  async getBySlug(slug: string) {
    const blog = await blogRepository.findBySlug(slug);
    if (!blog) {
      const { NotFoundError } = await import("../utils/errors");
      throw new NotFoundError("Blog not found");
    }
    return blog;
  }

  async getById(id: string) {
    return blogRepository.findByIdOrThrow(id, "Blog not found");
  }

  async update(id: string, updates: Partial<BlogDocument>, user: UserDocument) {
    if (user.role !== "admin") throw new ForbiddenError("Admin only");
    if (updates.title) updates.slug = uniqueSlug(updates.title);
    return blogRepository.updateById(id, {
      $set: { ...updates, updatedAt: new Date() },
    });
  }

  async remove(id: string, user: UserDocument) {
    if (user.role !== "admin") throw new ForbiddenError("Admin only");
    await blogRepository.deleteById(id);
    return { deleted: true };
  }
}

export const reviewService = new ReviewService();
export const blogService = new BlogService();
