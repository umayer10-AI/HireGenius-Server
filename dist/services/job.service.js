"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.jobService = exports.JobService = void 0;
const mongodb_1 = require("mongodb");
const company_repository_1 = require("../repositories/company.repository");
const job_repository_1 = require("../repositories/job.repository");
const user_repository_1 = require("../repositories/user.repository");
const errors_1 = require("../utils/errors");
const helpers_1 = require("../utils/helpers");
const response_1 = require("../utils/response");
const upload_service_1 = require("./upload.service");
class JobService {
    async create(data, user) {
        if (!user._id)
            throw new errors_1.ForbiddenError("Invalid user");
        const company = await company_repository_1.companyRepository.findByIdOrThrow(data.companyId, "Company not found");
        if (user.role !== "admin" &&
            company.ownerId.toString() !== user._id.toString()) {
            throw new errors_1.ForbiddenError("You can only post jobs for your company");
        }
        const now = new Date();
        return job_repository_1.jobRepository.insertOne({
            ...data,
            companyId: new mongodb_1.ObjectId(data.companyId),
            createdBy: user._id,
            slug: (0, helpers_1.uniqueSlug)(data.title),
            views: 0,
            createdAt: now,
            updatedAt: now,
        });
    }
    async list(params, viewer) {
        if (params.search && viewer?._id) {
            await user_repository_1.userRepository.addSearchHistory(viewer._id, params.search);
        }
        const { data, total } = await job_repository_1.jobRepository.list(params);
        const enriched = await Promise.all(data.map(async (job) => {
            const company = await company_repository_1.companyRepository.findById(job.companyId);
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
        }));
        return {
            data: enriched,
            meta: (0, response_1.buildPaginationMeta)(params.page, params.limit, total),
        };
    }
    async getByIdOrSlug(idOrSlug, viewer) {
        let job = null;
        if (mongodb_1.ObjectId.isValid(idOrSlug)) {
            job = await job_repository_1.jobRepository.findById(idOrSlug);
        }
        if (!job) {
            job = await job_repository_1.jobRepository.findBySlug(idOrSlug);
        }
        if (!job || !job._id)
            throw new errors_1.NotFoundError("Job not found");
        await job_repository_1.jobRepository.incrementViews(job._id);
        if (viewer?._id) {
            await user_repository_1.userRepository.addRecentlyViewed(viewer._id, job._id);
        }
        const company = await company_repository_1.companyRepository.findById(job.companyId);
        return { ...job, company };
    }
    async update(id, updates, user) {
        const job = await job_repository_1.jobRepository.findByIdOrThrow(id, "Job not found");
        if (user.role !== "admin" && job.createdBy.toString() !== user._id?.toString()) {
            throw new errors_1.ForbiddenError("You can only edit your own jobs");
        }
        if (updates.title) {
            updates.slug = (0, helpers_1.uniqueSlug)(updates.title);
        }
        if (updates.companyId) {
            updates.companyId = new mongodb_1.ObjectId(String(updates.companyId));
        }
        if (updates.applicationDeadline) {
            updates.applicationDeadline = new Date(updates.applicationDeadline);
        }
        return job_repository_1.jobRepository.updateById(id, {
            $set: { ...updates, updatedAt: new Date() },
        });
    }
    async remove(id, user) {
        const job = await job_repository_1.jobRepository.findByIdOrThrow(id, "Job not found");
        if (user.role !== "admin" && job.createdBy.toString() !== user._id?.toString()) {
            throw new errors_1.ForbiddenError("You can only delete your own jobs");
        }
        if (job.bannerImage)
            await (0, upload_service_1.deleteCloudinaryAsset)(job.bannerImage);
        await job_repository_1.jobRepository.deleteById(id);
        return { deleted: true };
    }
    async uploadBanner(id, file, user) {
        const job = await job_repository_1.jobRepository.findByIdOrThrow(id, "Job not found");
        if (user.role !== "admin" && job.createdBy.toString() !== user._id?.toString()) {
            throw new errors_1.ForbiddenError("Forbidden");
        }
        const uploaded = await (0, upload_service_1.uploadBufferToCloudinary)(file.buffer, "jobs/banners", "image");
        if (job.bannerImage)
            await (0, upload_service_1.deleteCloudinaryAsset)(job.bannerImage);
        return job_repository_1.jobRepository.updateById(id, {
            $set: { bannerImage: uploaded.secure_url, updatedAt: new Date() },
        });
    }
    async getFeatured(limit = 8) {
        return this.list({ page: 1, limit, featured: true, status: "active", sort: "newest" });
    }
    async getMine(user, params) {
        if (!user._id)
            throw new errors_1.ForbiddenError("Invalid user");
        return this.list({
            ...params,
            createdBy: user._id.toString(),
            status: params.status || "all",
        });
    }
    async getCategories() {
        const jobs = await job_repository_1.jobRepository.findMany({ status: "active" });
        const map = new Map();
        for (const job of jobs) {
            map.set(job.category, (map.get(job.category) || 0) + 1);
        }
        return Array.from(map.entries()).map(([name, count]) => ({ name, count }));
    }
}
exports.JobService = JobService;
exports.jobService = new JobService();
//# sourceMappingURL=job.service.js.map