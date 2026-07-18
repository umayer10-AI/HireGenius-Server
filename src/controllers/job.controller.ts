import { Request, Response } from "express";
import { asyncHandler } from "../middlewares/error.middleware";
import { jobService } from "../services/job.service";
import { sendSuccess } from "../utils/response";

export const createJob = asyncHandler(async (req: Request, res: Response) => {
  const data = await jobService.create(req.body, req.user!);
  return sendSuccess(res, data, "Job created", 201);
});

export const listJobs = asyncHandler(async (req: Request, res: Response) => {
  const result = await jobService.list(req.query as never, req.user);
  return sendSuccess(res, result.data, "Jobs fetched", 200, result.meta);
});

export const getJob = asyncHandler(async (req: Request, res: Response) => {
  const data = await jobService.getByIdOrSlug(req.params.id, req.user);
  return sendSuccess(res, data, "Job fetched");
});

export const updateJob = asyncHandler(async (req: Request, res: Response) => {
  const data = await jobService.update(req.params.id, req.body, req.user!);
  return sendSuccess(res, data, "Job updated");
});

export const deleteJob = asyncHandler(async (req: Request, res: Response) => {
  const data = await jobService.remove(req.params.id, req.user!);
  return sendSuccess(res, data, "Job deleted");
});

export const uploadJobBanner = asyncHandler(async (req: Request, res: Response) => {
  const data = await jobService.uploadBanner(req.params.id, req.file!, req.user!);
  return sendSuccess(res, data, "Banner uploaded");
});

export const getFeaturedJobs = asyncHandler(async (_req: Request, res: Response) => {
  const result = await jobService.getFeatured(8);
  return sendSuccess(res, result.data, "Featured jobs fetched", 200, result.meta);
});

export const getMyJobs = asyncHandler(async (req: Request, res: Response) => {
  const result = await jobService.getMine(req.user!, req.query as never);
  return sendSuccess(res, result.data, "Your jobs fetched", 200, result.meta);
});

export const getJobCategories = asyncHandler(async (_req: Request, res: Response) => {
  const data = await jobService.getCategories();
  return sendSuccess(res, data, "Categories fetched");
});
