import { Request, Response } from "express";
import { asyncHandler } from "../middlewares/error.middleware.js";
import { userService } from "../services/user.service.js";
import { sendSuccess } from "../utils/response.js";
import { calculateProfileCompletion } from "../utils/helpers.js";

export const getMe = asyncHandler(async (req: Request, res: Response) => {
  const data = await userService.getMe(req.user!);
  const completion = calculateProfileCompletion(req.user!);
  return sendSuccess(res, { ...data, profileCompletion: completion }, "Profile fetched");
});

export const listUsers = asyncHandler(async (req: Request, res: Response) => {
  const result = await userService.list(req.query as never);
  return sendSuccess(res, result.data, "Users fetched", 200, result.meta);
});

export const getUser = asyncHandler(async (req: Request, res: Response) => {
  const data = await userService.getById(req.params.id, req.user);
  return sendSuccess(res, data, "User fetched");
});

export const updateUser = asyncHandler(async (req: Request, res: Response) => {
  const data = await userService.update(req.params.id, req.body, req.user!);
  return sendSuccess(res, data, "User updated");
});

export const deleteUser = asyncHandler(async (req: Request, res: Response) => {
  const data = await userService.remove(req.params.id, req.user!);
  return sendSuccess(res, data, "User deleted");
});

export const uploadAvatar = asyncHandler(async (req: Request, res: Response) => {
  if (!req.file) {
    return sendSuccess(res, null, "No file uploaded", 400);
  }
  const data = await userService.uploadAvatar(req.user!._id!.toString(), req.file);
  return sendSuccess(res, data, "Avatar uploaded");
});

export const uploadResume = asyncHandler(async (req: Request, res: Response) => {
  if (!req.file) {
    return sendSuccess(res, null, "No file uploaded", 400);
  }
  const data = await userService.uploadResume(req.user!._id!.toString(), req.file);
  return sendSuccess(res, data, "Resume uploaded");
});

export const deleteResume = asyncHandler(async (req: Request, res: Response) => {
  const data = await userService.deleteResume(req.user!._id!.toString());
  return sendSuccess(res, data, "Resume deleted");
});

export const clearSearchHistory = asyncHandler(async (req: Request, res: Response) => {
  const data = await userService.clearSearchHistory(req.user!._id!.toString());
  return sendSuccess(res, data, "Search history cleared");
});

export const clearRecentlyViewed = asyncHandler(async (req: Request, res: Response) => {
  const data = await userService.clearRecentlyViewed(req.user!._id!.toString());
  return sendSuccess(res, data, "Recently viewed cleared");
});

export const setMyRole = asyncHandler(async (req: Request, res: Response) => {
  const data = await userService.setMyRole(req.user!, req.body.role);
  return sendSuccess(res, data, "Role updated");
});
