import { Response } from "express";
import type { PaginationMeta } from "../types/index.js";
export declare function sendSuccess<T>(res: Response, data: T, message?: string, statusCode?: number, meta?: PaginationMeta): Response;
export declare function sendError(res: Response, message: string, statusCode?: number, error?: unknown): Response;
export declare function buildPaginationMeta(page: number, limit: number, total: number): PaginationMeta;
//# sourceMappingURL=response.d.ts.map