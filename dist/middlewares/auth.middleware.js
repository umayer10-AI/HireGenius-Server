import { fromNodeHeaders } from "better-auth/node";
import { auth } from "../lib/auth.js";
import { getCollection } from "../config/database.js";
import { COLLECTIONS } from "../constants/index.js";
import { ForbiddenError, UnauthorizedError } from "../utils/errors.js";
import { asyncHandler } from "./error.middleware.js";
export const requireAuth = asyncHandler(async (req, _res, next) => {
    const session = await auth.api.getSession({
        headers: fromNodeHeaders(req.headers),
    });
    if (!session?.user) {
        throw new UnauthorizedError("Authentication required");
    }
    const users = getCollection(COLLECTIONS.USERS);
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
        throw new UnauthorizedError("User profile not found");
    }
    req.user = user;
    req.session = {
        id: session.session.id,
        userId: session.user.id,
        expiresAt: new Date(session.session.expiresAt),
    };
    next();
});
export const optionalAuth = asyncHandler(async (req, _res, next) => {
    try {
        const session = await auth.api.getSession({
            headers: fromNodeHeaders(req.headers),
        });
        if (session?.user) {
            const users = getCollection(COLLECTIONS.USERS);
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
    return asyncHandler(async (req, _res, next) => {
        if (!req.user) {
            throw new UnauthorizedError("Authentication required");
        }
        if (!roles.includes(req.user.role)) {
            throw new ForbiddenError("You do not have permission to perform this action");
        }
        next();
    });
}
export const requireAdmin = requireRole("admin");
export const requireRecruiter = requireRole("recruiter", "admin");
export const requireCandidate = requireRole("candidate", "admin");
export function requireOwnershipOrAdmin(ownerId, user) {
    if (user.role === "admin")
        return true;
    if (!ownerId || !user._id)
        return false;
    return ownerId.toString() === user._id.toString();
}
//# sourceMappingURL=auth.middleware.js.map