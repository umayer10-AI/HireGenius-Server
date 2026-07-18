import { NextFunction, Request, Response } from "express";
import { ZodSchema } from "zod";
export declare function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction): Response;
export declare function notFoundHandler(req: Request, res: Response): Response;
export declare function asyncHandler(fn: (req: Request, res: Response, next: NextFunction) => Promise<unknown>): (req: Request, res: Response, next: NextFunction) => void;
type RequestSource = "body" | "query" | "params";
export declare function validate(schema: ZodSchema, source?: RequestSource): (req: Request, _res: Response, next: NextFunction) => void;
export {};
//# sourceMappingURL=error.middleware.d.ts.map