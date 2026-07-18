"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.applicationService = exports.ApplicationService = void 0;
const application_repository_1 = require("../repositories/application.repository");
const company_repository_1 = require("../repositories/company.repository");
const job_repository_1 = require("../repositories/job.repository");
const user_repository_1 = require("../repositories/user.repository");
const errors_1 = require("../utils/errors");
const response_1 = require("../utils/response");
const notification_service_1 = require("./notification.service");
const email_service_1 = require("./email.service");
const upload_service_1 = require("./upload.service");
class ApplicationService {
    async apply(input, candidate, resumeFile) {
        if (!candidate._id)
            throw new errors_1.ForbiddenError("Invalid user");
        if (candidate.role !== "candidate" && candidate.role !== "admin") {
            throw new errors_1.ForbiddenError("Only candidates can apply to jobs");
        }
        const job = await job_repository_1.jobRepository.findByIdOrThrow(input.jobId, "Job not found");
        if (job.status !== "active") {
            throw new errors_1.ConflictError("This job is no longer accepting applications");
        }
        const existing = await application_repository_1.applicationRepository.findExisting(job._id, candidate._id);
        if (existing)
            throw new errors_1.ConflictError("You have already applied to this job");
        let resumeUrl = input.resume || candidate.resume;
        if (resumeFile) {
            const uploaded = await (0, upload_service_1.uploadBufferToCloudinary)(resumeFile.buffer, "applications", "raw");
            resumeUrl = uploaded.secure_url;
        }
        if (!resumeUrl)
            throw new errors_1.ConflictError("Resume is required to apply");
        const now = new Date();
        const application = await application_repository_1.applicationRepository.insertOne({
            jobId: job._id,
            candidateId: candidate._id,
            resume: resumeUrl,
            coverLetter: input.coverLetter,
            expectedSalary: input.expectedSalary,
            portfolio: input.portfolio || candidate.portfolio,
            github: input.github || candidate.github,
            linkedin: input.linkedin || candidate.linkedin,
            status: "Applied",
            createdAt: now,
            updatedAt: now,
        });
        await user_repository_1.userRepository.pushAppliedJob(candidate._id, job._id);
        const company = await company_repository_1.companyRepository.findById(job.companyId);
        await (0, notification_service_1.createNotification)({
            receiverId: job.createdBy,
            title: "New application received",
            message: `${candidate.name} applied for ${job.title}`,
            type: "info",
            link: `/dashboard/applicants`,
        });
        await (0, email_service_1.sendApplicationSubmittedEmail)(candidate.name, candidate.email, job.title, company?.companyName || "Company");
        return application;
    }
    async list(params, requester) {
        const query = { ...params };
        if (requester.role === "candidate") {
            query.candidateId = requester._id.toString();
        }
        else if (requester.role === "recruiter") {
            if (!query.jobId) {
                const myJobs = await job_repository_1.jobRepository.findMany({ createdBy: requester._id });
                const jobIds = myJobs.map((j) => j._id).filter(Boolean);
                const all = [];
                let total = 0;
                for (const jobId of jobIds) {
                    const result = await application_repository_1.applicationRepository.list({
                        ...query,
                        jobId: jobId.toString(),
                        page: 1,
                        limit: 1000,
                    });
                    all.push(...result.data);
                    total += result.total;
                }
                all.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
                const start = (params.page - 1) * params.limit;
                const sliced = all.slice(start, start + params.limit);
                const enriched = await this.enrich(sliced);
                return {
                    data: enriched,
                    meta: (0, response_1.buildPaginationMeta)(params.page, params.limit, total),
                };
            }
            const job = await job_repository_1.jobRepository.findByIdOrThrow(query.jobId, "Job not found");
            if (job.createdBy.toString() !== requester._id?.toString()) {
                throw new errors_1.ForbiddenError("Forbidden");
            }
        }
        const { data, total } = await application_repository_1.applicationRepository.list(query);
        return {
            data: await this.enrich(data),
            meta: (0, response_1.buildPaginationMeta)(params.page, params.limit, total),
        };
    }
    async enrich(applications) {
        return Promise.all(applications.map(async (app) => {
            const [job, candidate] = await Promise.all([
                job_repository_1.jobRepository.findById(app.jobId),
                user_repository_1.userRepository.findById(app.candidateId),
            ]);
            const company = job ? await company_repository_1.companyRepository.findById(job.companyId) : null;
            return {
                ...app,
                job: job
                    ? {
                        _id: job._id,
                        title: job.title,
                        slug: job.slug,
                        location: job.location,
                        companyName: company?.companyName,
                        companyLogo: company?.logo,
                    }
                    : null,
                candidate: candidate
                    ? {
                        _id: candidate._id,
                        name: candidate.name,
                        email: candidate.email,
                        image: candidate.image,
                        skills: candidate.skills,
                        resume: candidate.resume,
                    }
                    : null,
            };
        }));
    }
    async getById(id, requester) {
        const application = await application_repository_1.applicationRepository.findByIdOrThrow(id, "Application not found");
        const job = await job_repository_1.jobRepository.findById(application.jobId);
        const isOwner = application.candidateId.toString() === requester._id?.toString();
        const isRecruiter = job && job.createdBy.toString() === requester._id?.toString();
        if (requester.role !== "admin" && !isOwner && !isRecruiter) {
            throw new errors_1.ForbiddenError("Forbidden");
        }
        const [enriched] = await this.enrich([application]);
        return enriched;
    }
    async updateStatus(id, updates, requester) {
        const application = await application_repository_1.applicationRepository.findByIdOrThrow(id, "Application not found");
        const job = await job_repository_1.jobRepository.findByIdOrThrow(application.jobId, "Job not found");
        if (requester.role !== "admin" &&
            job.createdBy.toString() !== requester._id?.toString()) {
            throw new errors_1.ForbiddenError("Only recruiters can update application status");
        }
        const updated = await application_repository_1.applicationRepository.updateById(id, {
            $set: { ...updates, updatedAt: new Date() },
        });
        if (updates.status) {
            const candidate = await user_repository_1.userRepository.findById(application.candidateId);
            if (candidate) {
                await (0, notification_service_1.createNotification)({
                    receiverId: candidate._id,
                    title: "Application status updated",
                    message: `Your application for ${job.title} is now ${updates.status}`,
                    type: updates.status === "Rejected" ? "warning" : "success",
                    link: `/dashboard/applications`,
                });
                await (0, email_service_1.sendApplicationStatusEmail)(candidate.name, candidate.email, job.title, updates.status);
            }
        }
        return updated;
    }
    async remove(id, requester) {
        const application = await application_repository_1.applicationRepository.findByIdOrThrow(id, "Application not found");
        if (requester.role !== "admin" &&
            application.candidateId.toString() !== requester._id?.toString()) {
            throw new errors_1.ForbiddenError("Forbidden");
        }
        await application_repository_1.applicationRepository.deleteById(id);
        return { deleted: true };
    }
}
exports.ApplicationService = ApplicationService;
exports.applicationService = new ApplicationService();
//# sourceMappingURL=application.service.js.map