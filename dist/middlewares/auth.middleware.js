"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireCandidate = exports.requireRecruiter = exports.requireAdmin = exports.optionalAuth = exports.requireAuth = void 0;
exports.requireOwnershipOrAdmin = requireOwnershipOrAdmin;
const node_1 = require("better-auth/node");
const auth_1 = require("../lib/auth");
const database_1 = require("../config/database");
const constants_1 = require("../constants");
const errors_1 = require("../utils/errors");
const error_middleware_1 = require("./error.middleware");
exports.requireAuth = (0, error_middleware_1.asyncHandler)(async (req, _res, next) => {
    const session = await auth_1.auth.api.getSession({
        headers: (0, node_1.fromNodeHeaders)(req.headers),
    });
    if (!session?.user) {
        throw new errors_1.UnauthorizedError("Authentication required");
    }
    const users = (0, database_1.getCollection)(constants_1.COLLECTIONS.USERS);
    let user = await users.findOne({
        $or: [
            { betterAuthUserId: session.user.id },
            { email: session.user.email.toLowerCase() },
        ],
    });
    if (!user) {
        const now = new Date();
        const insertResult = await users.insertOne({
            name: session.user.name || "User",
            email: session.user.email.toLowerCase(),
            image: session.user.image ?? undefined,
            role: "candidate",
            skills: [],
            education: [],
            experience: [],
            savedJobs: [],
            appliedJobs: [],
            isVerified: Boolean(session.user.emailVerified),
            isPremium: false,
            emailVerified: Boolean(session.user.emailVerified),
            betterAuthUserId: session.user.id,
            searchHistory: [],
            recentlyViewedJobs: [],
            notificationPreferences: {
                email: true,
                push: true,
                applicationUpdates: true,
                interviewUpdates: true,
                marketing: false,
            },
            privacy: {
                publicProfile: true,
                hideEmail: true,
                hidePhone: true,
            },
            createdAt: now,
            updatedAt: now,
        });
        user = await users.findOne({ _id: insertResult.insertedId });
    }
    if (!user) {
        throw new errors_1.UnauthorizedError("User profile not found");
    }
    req.user = user;
    req.session = {
        id: session.session.id,
        userId: session.user.id,
        expiresAt: new Date(session.session.expiresAt),
    };
    next();
});
exports.optionalAuth = (0, error_middleware_1.asyncHandler)(async (req, _res, next) => {
    try {
        const session = await auth_1.auth.api.getSession({
            headers: (0, node_1.fromNodeHeaders)(req.headers),
        });
        if (session?.user) {
            const users = (0, database_1.getCollection)(constants_1.COLLECTIONS.USERS);
            const user = await users.findOne({
                $or: [
                    { betterAuthUserId: session.user.id },
                    { email: session.user.email.toLowerCase() },
                ],
            });
            if (user) {
                req.user = user;
                req.session = {
                    id: session.session.id,
                    userId: session.user.id,
                    expiresAt: new Date(session.session.expiresAt),
                };
            }
        }
    }
    catch {
        // ignore — optional auth
    }
    next();
});
function requireRole(...roles) {
    return (0, error_middleware_1.asyncHandler)(async (req, _res, next) => {
        if (!req.user) {
            throw new errors_1.UnauthorizedError("Authentication required");
        }
        if (!roles.includes(req.user.role)) {
            throw new errors_1.ForbiddenError("You do not have permission to perform this action");
        }
        next();
    });
}
exports.requireAdmin = requireRole("admin");
exports.requireRecruiter = requireRole("recruiter", "admin");
exports.requireCandidate = requireRole("candidate", "admin");
function requireOwnershipOrAdmin(ownerId, user) {
    if (user.role === "admin")
        return true;
    if (!ownerId || !user._id)
        return false;
    return ownerId.toString() === user._id.toString();
}
//# sourceMappingURL=auth.middleware.js.map