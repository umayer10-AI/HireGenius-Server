"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.savedJobService = exports.SavedJobService = void 0;
const mongodb_1 = require("mongodb");
const company_repository_1 = require("../repositories/company.repository");
const job_repository_1 = require("../repositories/job.repository");
const repositories_1 = require("../repositories");
const user_repository_1 = require("../repositories/user.repository");
const errors_1 = require("../utils/errors");
const response_1 = require("../utils/response");
const notification_service_1 = require("./notification.service");
class SavedJobService {
    async save(jobId, user) {
        if (!user._id)
            throw new errors_1.ForbiddenError("Invalid user");
        const job = await job_repository_1.jobRepository.findByIdOrThrow(jobId, "Job not found");
        const existing = await repositories_1.savedJobRepository.findExisting(user._id, job._id);
        if (existing)
            throw new errors_1.ConflictError("Job already saved");
        const now = new Date();
        const saved = await repositories_1.savedJobRepository.insertOne({
            userId: user._id,
            jobId: job._id,
            createdAt: now,
            updatedAt: now,
        });
        await user_repository_1.userRepository.pushSavedJob(user._id, job._id);
        await (0, notification_service_1.createNotification)({
            receiverId: user._id,
            title: "Job saved",
            message: `${job.title} was added to your saved jobs`,
            type: "success",
            link: `/dashboard/saved-jobs`,
        });
        return saved;
    }
    async list(user, page, limit) {
        if (!user._id)
            throw new errors_1.ForbiddenError("Invalid user");
        const { data, total } = await repositories_1.savedJobRepository.listByUser(user._id, page, limit);
        const enriched = await Promise.all(data.map(async (item) => {
            const job = await job_repository_1.jobRepository.findById(item.jobId);
            const company = job ? await company_repository_1.companyRepository.findById(job.companyId) : null;
            return {
                ...item,
                job: job
                    ? {
                        ...job,
                        company: company
                            ? {
                                _id: company._id,
                                companyName: company.companyName,
                                logo: company.logo,
                            }
                            : null,
                    }
                    : null,
            };
        }));
        return {
            data: enriched,
            meta: (0, response_1.buildPaginationMeta)(page, limit, total),
        };
    }
    async remove(idOrJobId, user) {
        if (!user._id)
            throw new errors_1.ForbiddenError("Invalid user");
        let jobId = null;
        const byId = await repositories_1.savedJobRepository.findById(idOrJobId);
        if (byId) {
            if (byId.userId.toString() !== user._id.toString()) {
                throw new errors_1.ForbiddenError("Forbidden");
            }
            jobId = byId.jobId;
            await repositories_1.savedJobRepository.deleteById(idOrJobId);
        }
        else if (mongodb_1.ObjectId.isValid(idOrJobId)) {
            const deleted = await repositories_1.savedJobRepository.deleteByUserAndJob(user._id, new mongodb_1.ObjectId(idOrJobId));
            if (!deleted)
                throw new errors_1.NotFoundError("Saved job not found");
            jobId = new mongodb_1.ObjectId(idOrJobId);
        }
        else {
            throw new errors_1.NotFoundError("Saved job not found");
        }
        if (jobId) {
            await user_repository_1.userRepository.pullSavedJob(user._id, jobId);
        }
        return { deleted: true };
    }
}
exports.SavedJobService = SavedJobService;
exports.savedJobService = new SavedJobService();
//# sourceMappingURL=saved-job.service.js.map