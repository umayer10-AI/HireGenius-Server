"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = errorHandler;
exports.notFoundHandler = notFoundHandler;
exports.asyncHandler = asyncHandler;
exports.validate = validate;
const zod_1 = require("zod");
const errors_1 = require("../utils/errors");
const response_1 = require("../utils/response");
const logger_1 = require("../utils/logger");
function errorHandler(err, _req, res, _next) {
    if (err instanceof errors_1.AppError) {
        return (0, response_1.sendError)(res, err.message, err.statusCode, err.details);
    }
    if (err instanceof zod_1.ZodError) {
        return (0, response_1.sendError)(res, "Validation failed", 422, err.flatten());
    }
    logger_1.logger.error("Unhandled error", err);
    return (0, response_1.sendError)(res, "Internal server error", 500);
}
function notFoundHandler(req, res) {
    return (0, response_1.sendError)(res, `Route not found: ${req.method} ${req.originalUrl}`, 404);
}
function asyncHandler(fn) {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
}
function validate(schema, source = "body") {
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