import { Request, Response } from "express";
import { asyncHandler } from "../middlewares/error.middleware.js";
import { companyService } from "../services/company.service.js";
import { sendSuccess } from "../utils/response.js";

export const createCompany = asyncHandler(async (req: Request, res: Response) => {
  const data = await companyService.create(req.body, req.user!);
  return sendSuccess(res, data, "Company created", 201);
});

export const listCompanies = asyncHandler(async (req: Request, res: Response) => {
  const result = await companyService.list(req.query as never);
  return sendSuccess(res, result.data, "Companies fetched", 200, result.meta);
});

export const getCompany = asyncHandler(async (req: Request, res: Response) => {
  const data = await companyService.getById(req.params.id);
  return sendSuccess(res, data, "Company fetched");
});

export const updateCompany = asyncHandler(async (req: Request, res: Response) => {
  const data = await companyService.update(req.params.id, req.body, req.user!);
  return sendSuccess(res, data, "Company updated");
});

export const deleteCompany = asyncHandler(async (req: Request, res: Response) => {
  const data = await companyService.remove(req.params.id, req.user!);
  return sendSuccess(res, data, "Company deleted");
});

export const uploadCompanyLogo = asyncHandler(async (req: Request, res: Response) => {
  const data = await companyService.uploadLogo(req.params.id, req.file!, req.user!);
  return sendSuccess(res, data, "Logo uploaded");
});

export const uploadCompanyBanner = asyncHandler(async (req: Request, res: Response) => {
  const data = await companyService.uploadBanner(req.params.id, req.file!, req.user!);
  return sendSuccess(res, data, "Banner uploaded");
});

export const getMyCompanies = asyncHandler(async (req: Request, res: Response) => {
  const data = await companyService.getMine(req.user!._id!);
  return sendSuccess(res, data, "Your companies fetched");
});
