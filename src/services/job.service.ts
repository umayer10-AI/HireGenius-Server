import { ObjectId } from "mongodb";
import { companyRepository } from "../repositories/company.repository.js";
import { jobRepository, type JobListParams } from "../repositories/job.repository.js";
import { userRepository } from "../repositories/user.repository.js";
import type { JobDocument, UserDocument } from "../interfaces/models.js";
import { ForbiddenError, NotFoundError } from "../utils/errors.js";
import { uniqueSlug } from "../utils/helpers.js";
import { buildPaginationMeta } from "../utils/response.js";
import { deleteCloudinaryAsset, uploadBufferToCloudinary } from "./upload.service.js";

export class JobService {
  async create(
    data: Omit<
      JobDocument,
      "_id" | "slug" | "createdBy" | "views" | "createdAt" | "updatedAt"
    >,
    user: UserDocument
  ) {
    if (!user._id) throw new ForbiddenError("Invalid user");
    const company = await companyRepository.findByIdOrThrow(data.companyId, "Company not found");
    if (
      user.role !== "admin" &&
      company.ownerId.toString() !== user._id.toString()
    ) {
      throw new ForbiddenError("You can only post jobs for your company");
    }

    const now = new Date();
    return jobRepository.insertOne({
      ...data,
      companyId: new ObjectId(data.companyId),
      createdBy: user._id,
      slug: uniqueSlug(data.title),
      views: 0,
      createdAt: now,
      updatedAt: now,
    });
  }

  async list(params: JobListParams, viewer?: UserDocument) {
    if (params.search && viewer?._id) {
      await userRepository.addSearchHistory(viewer._id, params.search);
    }

    const { data, total } = await jobRepository.list(params);
    const enriched = await Promise.all(
      data.map(async (job) => {
        const company = await companyRepository.findById(job.companyId);
        return {
          ...job,
          company: company
            ? {
                _id: company._id,
                companyName: company.companyName,
                logo: company.logo,
                location: company.location,
                industry: company.industry,
                rating: company.rating,
              }
            : null,
        };
      })
    );

    return {
      data: enriched,
      meta: buildPaginationMeta(params.page, params.limit, total),
    };
  }

  async getByIdOrSlug(idOrSlug: string, viewer?: UserDocument) {
    let job: JobDocument | null = null;
    if (ObjectId.isValid(idOrSlug)) {
      job = await jobRepository.findById(idOrSlug);
    }
    if (!job) {
      job = await jobRepository.findBySlug(idOrSlug);
    }
    if (!job || !job._id) throw new NotFoundError("Job not found");

    await jobRepository.incrementViews(job._id);
    if (viewer?._id) {
      await userRepository.addRecentlyViewed(viewer._id, job._id);
    }

    const company = await companyRepository.findById(job.companyId);
    return { ...job, company };
  }

  async update(id: string, updates: Partial<JobDocument>, user: UserDocument) {
    const job = await jobRepository.findByIdOrThrow(id, "Job not found");
    if (user.role !== "admin" && job.createdBy.toString() !== user._id?.toString()) {
      throw new ForbiddenError("You can only edit your own jobs");
    }
    if (updates.title) {
      updates.slug = uniqueSlug(updates.title);
    }
    if (updates.companyId) {
      updates.companyId = new ObjectId(String(updates.companyId));
    }
    if (updates.applicationDeadline) {
      updates.applicationDeadline = new Date(updates.applicationDeadline);
    }
    return jobRepository.updateById(id, {
      $set: { ...updates, updatedAt: new Date() },
    });
  }

  async remove(id: string, user: UserDocument) {
    const job = await jobRepository.findByIdOrThrow(id, "Job not found");
    if (user.role !== "admin" && job.createdBy.toString() !== user._id?.toString()) {
      throw new ForbiddenError("You can only delete your own jobs");
    }
    if (job.bannerImage) await deleteCloudinaryAsset(job.bannerImage);
    await jobRepository.deleteById(id);
    return { deleted: true };
  }

  async uploadBanner(id: string, file: Express.Multer.File, user: UserDocument) {
    const job = await jobRepository.findByIdOrThrow(id, "Job not found");
    if (user.role !== "admin" && job.createdBy.toString() !== user._id?.toString()) {
      throw new ForbiddenError("Forbidden");
    }
    const uploaded = await uploadBufferToCloudinary(file.buffer, "jobs/banners", "image");
    if (job.bannerImage) await deleteCloudinaryAsset(job.bannerImage);
    return jobRepository.updateById(id, {
      $set: { bannerImage: uploaded.secure_url, updatedAt: new Date() },
    });
  }

  async getFeatured(limit = 8) {
    return this.list({ page: 1, limit, featured: true, status: "active", sort: "newest" });
  }

  async getMine(
    user: UserDocument,
    params: {
      page: number;
      limit: number;
      search?: string;
      status?: string;
      sort?: string;
    }
  ) {
    if (!user._id) throw new ForbiddenError("Invalid user");
    return this.list({
      ...params,
      createdBy: user._id.toString(),
      status: params.status || "all",
    });
  }

  async getCategories() {
    const jobs = await jobRepository.findMany({ status: "active" });
    const map = new Map<string, number>();
    for (const job of jobs) {
      map.set(job.category, (map.get(job.category) || 0) + 1);
    }
    return Array.from(map.entries()).map(([name, count]) => ({ name, count }));
  }
}

export const jobService = new JobService();
