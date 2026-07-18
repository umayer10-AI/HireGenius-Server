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
exports.syncAuthProfile = exports.deleteAIChat = exports.renameAIChat = exports.listAIChats = exports.aiChat = exports.candidateMatch = exports.generateJobDescription = exports.interviewPrep = exports.skillGap = exports.recommendJobs = exports.generateCoverLetter = exports.generateResume = exports.subscribeNewsletter = exports.submitContact = exports.getPlatformStats = exports.getDashboard = exports.deleteNotification = exports.markAllNotificationsRead = exports.markNotificationRead = exports.listNotifications = exports.deleteBlog = exports.updateBlog = exports.getBlogBySlug = exports.listBlogs = exports.createBlog = exports.deleteReview = exports.updateReview = exports.listReviews = exports.createReview = exports.removeSavedJob = exports.listSavedJobs = exports.saveJob = exports.deleteApplication = exports.updateApplication = exports.getApplication = exports.listApplications = exports.createApplication = void 0;
const error_middleware_1 = require("../middlewares/error.middleware");
const application_service_1 = require("../services/application.service");
const saved_job_service_1 = require("../services/saved-job.service");
const review_service_1 = require("../services/review.service");
const dashboard_service_1 = require("../services/dashboard.service");
const contact_service_1 = require("../services/contact.service");
const notificationService = __importStar(require("../services/notification.service"));
const ai_service_1 = require("../services/ai/ai.service");
const response_1 = require("../utils/response");
const errors_1 = require("../utils/errors");
const response_2 = require("../utils/response");
exports.createApplication = (0, error_middleware_1.asyncHandler)(async (req, res) => {
    const data = await application_service_1.applicationService.apply(req.body, req.user, req.file);
    return (0, response_1.sendSuccess)(res, data, "Application submitted", 201);
});
exports.listApplications = (0, error_middleware_1.asyncHandler)(async (req, res) => {
    const result = await application_service_1.applicationService.list(req.query, req.user);
    return (0, response_1.sendSuccess)(res, result.data, "Applications fetched", 200, result.meta);
});
exports.getApplication = (0, error_middleware_1.asyncHandler)(async (req, res) => {
    const data = await application_service_1.applicationService.getById(req.params.id, req.user);
    return (0, response_1.sendSuccess)(res, data, "Application fetched");
});
exports.updateApplication = (0, error_middleware_1.asyncHandler)(async (req, res) => {
    const data = await application_service_1.applicationService.updateStatus(req.params.id, req.body, req.user);
    return (0, response_1.sendSuccess)(res, data, "Application updated");
});
exports.deleteApplication = (0, error_middleware_1.asyncHandler)(async (req, res) => {
    const data = await application_service_1.applicationService.remove(req.params.id, req.user);
    return (0, response_1.sendSuccess)(res, data, "Application deleted");
});
exports.saveJob = (0, error_middleware_1.asyncHandler)(async (req, res) => {
    const data = await saved_job_service_1.savedJobService.save(req.body.jobId, req.user);
    return (0, response_1.sendSuccess)(res, data, "Job saved", 201);
});
exports.listSavedJobs = (0, error_middleware_1.asyncHandler)(async (req, res) => {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 12;
    const result = await saved_job_service_1.savedJobService.list(req.user, page, limit);
    return (0, response_1.sendSuccess)(res, result.data, "Saved jobs fetched", 200, result.meta);
});
exports.removeSavedJob = (0, error_middleware_1.asyncHandler)(async (req, res) => {
    const data = await saved_job_service_1.savedJobService.remove(req.params.id, req.user);
    return (0, response_1.sendSuccess)(res, data, "Saved job removed");
});
exports.createReview = (0, error_middleware_1.asyncHandler)(async (req, res) => {
    const data = await review_service_1.reviewService.create(req.body, req.user);
    return (0, response_1.sendSuccess)(res, data, "Review created", 201);
});
exports.listReviews = (0, error_middleware_1.asyncHandler)(async (req, res) => {
    const result = await review_service_1.reviewService.list(req.query);
    return (0, response_1.sendSuccess)(res, result.data, "Reviews fetched", 200, result.meta);
});
exports.updateReview = (0, error_middleware_1.asyncHandler)(async (req, res) => {
    const data = await review_service_1.reviewService.update(req.params.id, req.body, req.user);
    return (0, response_1.sendSuccess)(res, data, "Review updated");
});
exports.deleteReview = (0, error_middleware_1.asyncHandler)(async (req, res) => {
    const data = await review_service_1.reviewService.remove(req.params.id, req.user);
    return (0, response_1.sendSuccess)(res, data, "Review deleted");
});
exports.createBlog = (0, error_middleware_1.asyncHandler)(async (req, res) => {
    const data = await review_service_1.blogService.create(req.body, req.user);
    return (0, response_1.sendSuccess)(res, data, "Blog created", 201);
});
exports.listBlogs = (0, error_middleware_1.asyncHandler)(async (req, res) => {
    const result = await review_service_1.blogService.list(req.query);
    return (0, response_1.sendSuccess)(res, result.data, "Blogs fetched", 200, result.meta);
});
exports.getBlogBySlug = (0, error_middleware_1.asyncHandler)(async (req, res) => {
    const data = await review_service_1.blogService.getBySlug(req.params.slug);
    return (0, response_1.sendSuccess)(res, data, "Blog fetched");
});
exports.updateBlog = (0, error_middleware_1.asyncHandler)(async (req, res) => {
    const data = await review_service_1.blogService.update(req.params.id, req.body, req.user);
    return (0, response_1.sendSuccess)(res, data, "Blog updated");
});
exports.deleteBlog = (0, error_middleware_1.asyncHandler)(async (req, res) => {
    const data = await review_service_1.blogService.remove(req.params.id, req.user);
    return (0, response_1.sendSuccess)(res, data, "Blog deleted");
});
exports.listNotifications = (0, error_middleware_1.asyncHandler)(async (req, res) => {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;
    const result = await notificationService.getUserNotifications(req.user._id, page, limit);
    return (0, response_1.sendSuccess)(res, { items: result.data, unreadCount: result.unreadCount }, "Notifications fetched", 200, (0, response_2.buildPaginationMeta)(page, limit, result.total));
});
exports.markNotificationRead = (0, error_middleware_1.asyncHandler)(async (req, res) => {
    const data = await notificationService.markNotificationRead(req.params.id, req.user._id);
    return (0, response_1.sendSuccess)(res, data, "Notification marked as read");
});
exports.markAllNotificationsRead = (0, error_middleware_1.asyncHandler)(async (req, res) => {
    const count = await notificationService.markAllNotificationsRead(req.user._id);
    return (0, response_1.sendSuccess)(res, { count }, "All notifications marked as read");
});
exports.deleteNotification = (0, error_middleware_1.asyncHandler)(async (req, res) => {
    const data = await notificationService.deleteNotification(req.params.id, req.user._id);
    return (0, response_1.sendSuccess)(res, data, "Notification deleted");
});
exports.getDashboard = (0, error_middleware_1.asyncHandler)(async (req, res) => {
    const role = req.user.role;
    if (role === "admin") {
        return (0, response_1.sendSuccess)(res, await dashboard_service_1.dashboardService.getAdminDashboard(), "Admin dashboard");
    }
    if (role === "recruiter") {
        return (0, response_1.sendSuccess)(res, await dashboard_service_1.dashboardService.getRecruiterDashboard(req.user), "Recruiter dashboard");
    }
    return (0, response_1.sendSuccess)(res, await dashboard_service_1.dashboardService.getCandidateDashboard(req.user), "Candidate dashboard");
});
exports.getPlatformStats = (0, error_middleware_1.asyncHandler)(async (_req, res) => {
    const data = await dashboard_service_1.dashboardService.getPlatformStats();
    return (0, response_1.sendSuccess)(res, data, "Platform stats fetched");
});
exports.submitContact = (0, error_middleware_1.asyncHandler)(async (req, res) => {
    const data = await contact_service_1.contactService.submitContact(req.body);
    return (0, response_1.sendSuccess)(res, data, "Message received", 201);
});
exports.subscribeNewsletter = (0, error_middleware_1.asyncHandler)(async (req, res) => {
    const data = await contact_service_1.contactService.subscribeNewsletter(req.body.email);
    return (0, response_1.sendSuccess)(res, data, "Subscribed successfully", 201);
});
exports.generateResume = (0, error_middleware_1.asyncHandler)(async (req, res) => {
    const data = await ai_service_1.aiService.generateResume(req.user, req.body);
    return (0, response_1.sendSuccess)(res, data, "Resume generated");
});
exports.generateCoverLetter = (0, error_middleware_1.asyncHandler)(async (req, res) => {
    const data = await ai_service_1.aiService.generateCoverLetter(req.user, req.body);
    return (0, response_1.sendSuccess)(res, data, "Cover letter generated");
});
exports.recommendJobs = (0, error_middleware_1.asyncHandler)(async (req, res) => {
    const limit = Number(req.body.limit) || 6;
    const data = await ai_service_1.aiService.recommendJobs(req.user, limit);
    return (0, response_1.sendSuccess)(res, data, "Recommendations ready");
});
exports.skillGap = (0, error_middleware_1.asyncHandler)(async (req, res) => {
    const data = await ai_service_1.aiService.skillGapAnalysis(req.user, req.body);
    return (0, response_1.sendSuccess)(res, data, "Skill gap analysis ready");
});
exports.interviewPrep = (0, error_middleware_1.asyncHandler)(async (req, res) => {
    const data = await ai_service_1.aiService.interviewPrep(req.user, req.body);
    return (0, response_1.sendSuccess)(res, data, "Interview prep ready");
});
exports.generateJobDescription = (0, error_middleware_1.asyncHandler)(async (req, res) => {
    const data = await ai_service_1.aiService.generateJobDescription(req.user, req.body);
    return (0, response_1.sendSuccess)(res, data, "Job description generated");
});
exports.candidateMatch = (0, error_middleware_1.asyncHandler)(async (req, res) => {
    const data = await ai_service_1.aiService.candidateMatch(req.user, req.body);
    return (0, response_1.sendSuccess)(res, data, "Candidate match analysis ready");
});
exports.aiChat = (0, error_middleware_1.asyncHandler)(async (req, res) => {
    const wantsStream = req.query.stream === "true" || req.headers.accept === "text/event-stream";
    if (wantsStream) {
        res.setHeader("Content-Type", "text/event-stream");
        res.setHeader("Cache-Control", "no-cache");
        res.setHeader("Connection", "keep-alive");
        const result = await ai_service_1.aiService.chat(req.user, req.body, (chunk) => {
            res.write(`data: ${JSON.stringify({ chunk })}\n\n`);
        });
        res.write(`data: ${JSON.stringify({ done: true, ...result })}\n\n`);
        res.end();
        return;
    }
    const data = await ai_service_1.aiService.chat(req.user, req.body);
    return (0, response_1.sendSuccess)(res, data, "Chat response ready");
});
exports.listAIChats = (0, error_middleware_1.asyncHandler)(async (req, res) => {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;
    const { data, total } = await ai_service_1.aiService.listChats(req.user, page, limit);
    return (0, response_1.sendSuccess)(res, data, "Chats fetched", 200, (0, response_2.buildPaginationMeta)(page, limit, total));
});
exports.renameAIChat = (0, error_middleware_1.asyncHandler)(async (req, res) => {
    const data = await ai_service_1.aiService.renameChat(req.user, req.params.id, req.body.title);
    return (0, response_1.sendSuccess)(res, data, "Chat renamed");
});
exports.deleteAIChat = (0, error_middleware_1.asyncHandler)(async (req, res) => {
    const data = await ai_service_1.aiService.deleteChat(req.user, req.params.id);
    return (0, response_1.sendSuccess)(res, data, "Chat deleted");
});
exports.syncAuthProfile = (0, error_middleware_1.asyncHandler)(async (req, res) => {
    if (!req.user)
        throw new errors_1.ForbiddenError("Unauthorized");
    return (0, response_1.sendSuccess)(res, await userServiceGetMe(req), "Session profile");
});
async function userServiceGetMe(req) {
    const { userService } = await Promise.resolve().then(() => __importStar(require("../services/user.service")));
    const { calculateProfileCompletion } = await Promise.resolve().then(() => __importStar(require("../utils/helpers")));
    return {
        ...(await userService.getMe(req.user)),
        profileCompletion: calculateProfileCompletion(req.user),
    };
}
//# sourceMappingURL=misc.controller.js.map