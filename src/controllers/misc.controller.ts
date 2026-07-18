import { Request, Response } from "express";
import { asyncHandler } from "../middlewares/error.middleware";
import { applicationService } from "../services/application.service";
import { savedJobService } from "../services/saved-job.service";
import { blogService, reviewService } from "../services/review.service";
import { dashboardService } from "../services/dashboard.service";
import { contactService } from "../services/contact.service";
import * as notificationService from "../services/notification.service";
import { aiService } from "../services/ai/ai.service";
import { sendSuccess } from "../utils/response";
import { ForbiddenError } from "../utils/errors";
import { buildPaginationMeta } from "../utils/response";

export const createApplication = asyncHandler(async (req: Request, res: Response) => {
  const data = await applicationService.apply(req.body, req.user!, req.file);
  return sendSuccess(res, data, "Application submitted", 201);
});

export const listApplications = asyncHandler(async (req: Request, res: Response) => {
  const result = await applicationService.list(req.query as never, req.user!);
  return sendSuccess(res, result.data, "Applications fetched", 200, result.meta);
});

export const getApplication = asyncHandler(async (req: Request, res: Response) => {
  const data = await applicationService.getById(req.params.id, req.user!);
  return sendSuccess(res, data, "Application fetched");
});

export const updateApplication = asyncHandler(async (req: Request, res: Response) => {
  const data = await applicationService.updateStatus(req.params.id, req.body, req.user!);
  return sendSuccess(res, data, "Application updated");
});

export const deleteApplication = asyncHandler(async (req: Request, res: Response) => {
  const data = await applicationService.remove(req.params.id, req.user!);
  return sendSuccess(res, data, "Application deleted");
});

export const saveJob = asyncHandler(async (req: Request, res: Response) => {
  const data = await savedJobService.save(req.body.jobId, req.user!);
  return sendSuccess(res, data, "Job saved", 201);
});

export const listSavedJobs = asyncHandler(async (req: Request, res: Response) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 12;
  const result = await savedJobService.list(req.user!, page, limit);
  return sendSuccess(res, result.data, "Saved jobs fetched", 200, result.meta);
});

export const removeSavedJob = asyncHandler(async (req: Request, res: Response) => {
  const data = await savedJobService.remove(req.params.id, req.user!);
  return sendSuccess(res, data, "Saved job removed");
});

export const createReview = asyncHandler(async (req: Request, res: Response) => {
  const data = await reviewService.create(req.body, req.user!);
  return sendSuccess(res, data, "Review created", 201);
});

export const listReviews = asyncHandler(async (req: Request, res: Response) => {
  const result = await reviewService.list(req.query as never);
  return sendSuccess(res, result.data, "Reviews fetched", 200, result.meta);
});

export const updateReview = asyncHandler(async (req: Request, res: Response) => {
  const data = await reviewService.update(req.params.id, req.body, req.user!);
  return sendSuccess(res, data, "Review updated");
});

export const deleteReview = asyncHandler(async (req: Request, res: Response) => {
  const data = await reviewService.remove(req.params.id, req.user!);
  return sendSuccess(res, data, "Review deleted");
});

export const createBlog = asyncHandler(async (req: Request, res: Response) => {
  const data = await blogService.create(req.body, req.user!);
  return sendSuccess(res, data, "Blog created", 201);
});

export const listBlogs = asyncHandler(async (req: Request, res: Response) => {
  const result = await blogService.list(req.query as never);
  return sendSuccess(res, result.data, "Blogs fetched", 200, result.meta);
});

export const getBlogBySlug = asyncHandler(async (req: Request, res: Response) => {
  const data = await blogService.getBySlug(req.params.slug);
  return sendSuccess(res, data, "Blog fetched");
});

export const updateBlog = asyncHandler(async (req: Request, res: Response) => {
  const data = await blogService.update(req.params.id, req.body, req.user!);
  return sendSuccess(res, data, "Blog updated");
});

export const deleteBlog = asyncHandler(async (req: Request, res: Response) => {
  const data = await blogService.remove(req.params.id, req.user!);
  return sendSuccess(res, data, "Blog deleted");
});

export const listNotifications = asyncHandler(async (req: Request, res: Response) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 20;
  const result = await notificationService.getUserNotifications(req.user!._id!, page, limit);
  return sendSuccess(
    res,
    { items: result.data, unreadCount: result.unreadCount },
    "Notifications fetched",
    200,
    buildPaginationMeta(page, limit, result.total)
  );
});

export const markNotificationRead = asyncHandler(async (req: Request, res: Response) => {
  const data = await notificationService.markNotificationRead(req.params.id, req.user!._id!);
  return sendSuccess(res, data, "Notification marked as read");
});

export const markAllNotificationsRead = asyncHandler(async (req: Request, res: Response) => {
  const count = await notificationService.markAllNotificationsRead(req.user!._id!);
  return sendSuccess(res, { count }, "All notifications marked as read");
});

export const deleteNotification = asyncHandler(async (req: Request, res: Response) => {
  const data = await notificationService.deleteNotification(req.params.id, req.user!._id!);
  return sendSuccess(res, data, "Notification deleted");
});

export const getDashboard = asyncHandler(async (req: Request, res: Response) => {
  const role = req.user!.role;
  if (role === "admin") {
    return sendSuccess(res, await dashboardService.getAdminDashboard(), "Admin dashboard");
  }
  if (role === "recruiter") {
    return sendSuccess(
      res,
      await dashboardService.getRecruiterDashboard(req.user!),
      "Recruiter dashboard"
    );
  }
  return sendSuccess(
    res,
    await dashboardService.getCandidateDashboard(req.user!),
    "Candidate dashboard"
  );
});

export const getPlatformStats = asyncHandler(async (_req: Request, res: Response) => {
  const data = await dashboardService.getPlatformStats();
  return sendSuccess(res, data, "Platform stats fetched");
});

export const submitContact = asyncHandler(async (req: Request, res: Response) => {
  const data = await contactService.submitContact(req.body);
  return sendSuccess(res, data, "Message received", 201);
});

export const subscribeNewsletter = asyncHandler(async (req: Request, res: Response) => {
  const data = await contactService.subscribeNewsletter(req.body.email);
  return sendSuccess(res, data, "Subscribed successfully", 201);
});

export const generateResume = asyncHandler(async (req: Request, res: Response) => {
  const data = await aiService.generateResume(req.user!, req.body);
  return sendSuccess(res, data, "Resume generated");
});

export const generateCoverLetter = asyncHandler(async (req: Request, res: Response) => {
  const data = await aiService.generateCoverLetter(req.user!, req.body);
  return sendSuccess(res, data, "Cover letter generated");
});

export const recommendJobs = asyncHandler(async (req: Request, res: Response) => {
  const limit = Number(req.body.limit) || 6;
  const data = await aiService.recommendJobs(req.user!, limit);
  return sendSuccess(res, data, "Recommendations ready");
});

export const skillGap = asyncHandler(async (req: Request, res: Response) => {
  const data = await aiService.skillGapAnalysis(req.user!, req.body);
  return sendSuccess(res, data, "Skill gap analysis ready");
});

export const interviewPrep = asyncHandler(async (req: Request, res: Response) => {
  const data = await aiService.interviewPrep(req.user!, req.body);
  return sendSuccess(res, data, "Interview prep ready");
});

export const generateJobDescription = asyncHandler(async (req: Request, res: Response) => {
  const data = await aiService.generateJobDescription(req.user!, req.body);
  return sendSuccess(res, data, "Job description generated");
});

export const candidateMatch = asyncHandler(async (req: Request, res: Response) => {
  const data = await aiService.candidateMatch(req.user!, req.body);
  return sendSuccess(res, data, "Candidate match analysis ready");
});

export const aiChat = asyncHandler(async (req: Request, res: Response) => {
  const wantsStream = req.query.stream === "true" || req.headers.accept === "text/event-stream";
  if (wantsStream) {
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    const result = await aiService.chat(req.user!, req.body, (chunk) => {
      res.write(`data: ${JSON.stringify({ chunk })}\n\n`);
    });
    res.write(`data: ${JSON.stringify({ done: true, ...result })}\n\n`);
    res.end();
    return;
  }
  const data = await aiService.chat(req.user!, req.body);
  return sendSuccess(res, data, "Chat response ready");
});

export const listAIChats = asyncHandler(async (req: Request, res: Response) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 20;
  const { data, total } = await aiService.listChats(req.user!, page, limit);
  return sendSuccess(res, data, "Chats fetched", 200, buildPaginationMeta(page, limit, total));
});

export const renameAIChat = asyncHandler(async (req: Request, res: Response) => {
  const data = await aiService.renameChat(req.user!, req.params.id, req.body.title);
  return sendSuccess(res, data, "Chat renamed");
});

export const deleteAIChat = asyncHandler(async (req: Request, res: Response) => {
  const data = await aiService.deleteChat(req.user!, req.params.id);
  return sendSuccess(res, data, "Chat deleted");
});

export const syncAuthProfile = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) throw new ForbiddenError("Unauthorized");
  return sendSuccess(res, await userServiceGetMe(req), "Session profile");
});

async function userServiceGetMe(req: Request) {
  const { userService } = await import("../services/user.service");
  const { calculateProfileCompletion } = await import("../utils/helpers");
  return {
    ...(await userService.getMe(req.user!)),
    profileCompletion: calculateProfileCompletion(req.user!),
  };
}
