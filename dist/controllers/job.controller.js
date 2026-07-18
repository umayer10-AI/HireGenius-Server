"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getJobCategories = exports.getFeaturedJobs = exports.uploadJobBanner = exports.deleteJob = exports.updateJob = exports.getJob = exports.listJobs = exports.createJob = void 0;
const error_middleware_1 = require("../middlewares/error.middleware");
const job_service_1 = require("../services/job.service");
const response_1 = require("../utils/response");
exports.createJob = (0, error_middleware_1.asyncHandler)(async (req, res) => {
    const data = await job_service_1.jobService.create(req.body, req.user);
    return (0, response_1.sendSuccess)(res, data, "Job created", 201);
});
exports.listJobs = (0, error_middleware_1.asyncHandler)(async (req, res) => {
    const result = await job_service_1.jobService.list(req.query, req.user);
    return (0, response_1.sendSuccess)(res, result.data, "Jobs fetched", 200, result.meta);
});
exports.getJob = (0, error_middleware_1.asyncHandler)(async (req, res) => {
    const data = await job_service_1.jobService.getByIdOrSlug(req.params.id, req.user);
    return (0, response_1.sendSuccess)(res, data, "Job fetched");
});
exports.updateJob = (0, error_middleware_1.asyncHandler)(async (req, res) => {
    const data = await job_service_1.jobService.update(req.params.id, req.body, req.user);
    return (0, response_1.sendSuccess)(res, data, "Job updated");
});
exports.deleteJob = (0, error_middleware_1.asyncHandler)(async (req, res) => {
    const data = await job_service_1.jobService.remove(req.params.id, req.user);
    return (0, response_1.sendSuccess)(res, data, "Job deleted");
});
exports.uploadJobBanner = (0, error_middleware_1.asyncHandler)(async (req, res) => {
    const data = await job_service_1.jobService.uploadBanner(req.params.id, req.file, req.user);
    return (0, response_1.sendSuccess)(res, data, "Banner uploaded");
});
exports.getFeaturedJobs = (0, error_middleware_1.asyncHandler)(async (_req, res) => {
    const result = await job_service_1.jobService.getFeatured(8);
    return (0, response_1.sendSuccess)(res, result.data, "Featured jobs fetched", 200, result.meta);
});
exports.getJobCategories = (0, error_middleware_1.asyncHandler)(async (_req, res) => {
    const data = await job_service_1.jobService.getCategories();
    return (0, response_1.sendSuccess)(res, data, "Categories fetched");
});
//# sourceMappingURL=job.controller.js.map