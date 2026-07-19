import { ZodError } from "zod";
import { AppError } from "../utils/errors.js";
import { sendError } from "../utils/response.js";
import { logger } from "../utils/logger.js";
export function errorHandler(err, _req, res, _next) {
    if (err instanceof AppError) {
        return sendError(res, err.message, err.statusCode, err.details);
    }
    if (err instanceof ZodError) {
        return sendError(res, "Validation failed", 422, err.flatten());
    }
    logger.error("Unhandled error", err);
    return sendError(res, "Internal server error", 500);
}
export function notFoundHandler(req, res) {
    return sendError(res, `Route not found: ${req.method} ${req.originalUrl}`, 404);
}
export function asyncHandler(fn) {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
}
export function validate(schema, source = "body") {
    return (req, _res, next) => {
        try {
            const parsed = schema.parse(req[source]);
            req[source] = parsed;
            next();
        }
        catch (error) {
            next(error);
        }
    };
}
//# sourceMappingURL=error.middleware.js.map