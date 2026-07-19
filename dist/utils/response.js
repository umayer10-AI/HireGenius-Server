export function sendSuccess(res, data, message = "Success", statusCode = 200, meta) {
    const body = {
        success: true,
        message,
        data,
        ...(meta ? { meta } : {}),
    };
    return res.status(statusCode).json(body);
}
export function sendError(res, message, statusCode = 500, error) {
    const body = {
        success: false,
        message,
        ...(error !== undefined ? { error } : {}),
    };
    return res.status(statusCode).json(body);
}
export function buildPaginationMeta(page, limit, total) {
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
//# sourceMappingURL=response.js.map