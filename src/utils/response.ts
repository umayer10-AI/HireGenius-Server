import { Response } from "express";
import type { ApiErrorResponse, ApiSuccessResponse, PaginationMeta } from "../types/index.js";

export function sendSuccess<T>(
  res: Response,
  data: T,
  message = "Success",
  statusCode = 200,
  meta?: PaginationMeta
): Response {
  const body: ApiSuccessResponse<T> = {
    success: true,
    message,
    data,
    ...(meta ? { meta } : {}),
  };
  return res.status(statusCode).json(body);
}

export function sendError(
  res: Response,
  message: string,
  statusCode = 500,
  error?: unknown
): Response {
  const body: ApiErrorResponse = {
    success: false,
    message,
    ...(error !== undefined ? { error } : {}),
  };
  return res.status(statusCode).json(body);
}

export function buildPaginationMeta(
  page: number,
  limit: number,
  total: number
): PaginationMeta {
  const totalPages = Math.max(1, Math.ceil(total / limit));
  return {
    page,
    limit,
    total,
    totalPages,
    hasNextPage: page < totalPages,
    hasPreviousPage: page > 1,
  };
}
