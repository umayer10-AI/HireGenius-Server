"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userService = exports.UserService = void 0;
const user_repository_1 = require("../repositories/user.repository");
const errors_1 = require("../utils/errors");
const helpers_1 = require("../utils/helpers");
const upload_service_1 = require("./upload.service");
const response_1 = require("../utils/response");
class UserService {
    async getMe(user) {
        const completion = (0, helpers_1.calculateProfileCompletion)(user);
        return {
            ...(0, helpers_1.omitPassword)(user),
            profileCompletion: completion,
        };
    }
    async getById(id, requester) {
        const user = await user_repository_1.userRepository.findByIdOrThrow(id, "User not found");
        if (requester &&
            requester.role !== "admin" &&
            requester._id?.toString() !== id &&
            user.privacy?.publicProfile === false) {
            throw new errors_1.ForbiddenError("This profile is private");
        }
        return (0, helpers_1.omitPassword)(user);
    }
    async list(params) {
        const { data, total } = await user_repository_1.userRepository.listUsers(params);
        return {
            data: data.map(helpers_1.omitPassword),
            meta: (0, response_1.buildPaginationMeta)(params.page, params.limit, total),
        };
    }
    async update(id, updates, requester) {
        if (requester.role !== "admin" && requester._id?.toString() !== id) {
            throw new errors_1.ForbiddenError("You can only update your own profile");
        }
        if (updates.role && requester.role !== "admin") {
            delete updates.role;
        }
        if (updates.isPremium !== undefined && requester.role !== "admin") {
            delete updates.isPremium;
        }
        if (updates.isVerified !== undefined && requester.role !== "admin") {
            delete updates.isVerified;
        }
        if (updates.email) {
            const existing = await user_repository_1.userRepository.findByEmail(updates.email);
            if (existing && existing._id?.toString() !== id) {
                throw new errors_1.ConflictError("Email already in use");
            }
            updates.email = updates.email.toLowerCase();
        }
        const updated = await user_repository_1.userRepository.updateById(id, {
            $set: { ...updates, updatedAt: new Date() },
        });
        return (0, helpers_1.omitPassword)(updated);
    }
    async remove(id, requester) {
        if (requester.role !== "admin" && requester._id?.toString() !== id) {
            throw new errors_1.ForbiddenError("You can only delete your own account");
        }
        await user_repository_1.userRepository.deleteById(id, "User not found");
        return { deleted: true };
    }
    async uploadAvatar(userId, file) {
        const user = await user_repository_1.userRepository.findByIdOrThrow(userId, "User not found");
        const uploaded = await (0, upload_service_1.uploadBufferToCloudinary)(file.buffer, "avatars", "image");
        if (user.image) {
            await (0, upload_service_1.deleteCloudinaryAsset)(user.image);
        }
        const updated = await user_repository_1.userRepository.updateById(userId, {
            $set: { image: uploaded.secure_url, updatedAt: new Date() },
        });
        return (0, helpers_1.omitPassword)(updated);
    }
    async uploadResume(userId, file) {
        const user = await user_repository_1.userRepository.findByIdOrThrow(userId, "User not found");
        const uploaded = await (0, upload_service_1.uploadBufferToCloudinary)(file.buffer, "resumes", "raw");
        if (user.resume) {
            await (0, upload_service_1.deleteCloudinaryAsset)(user.resume);
        }
        const updated = await user_repository_1.userRepository.updateById(userId, {
            $set: { resume: uploaded.secure_url, updatedAt: new Date() },
        });
        return (0, helpers_1.omitPassword)(updated);
    }
    async deleteResume(userId) {
        const user = await user_repository_1.userRepository.findByIdOrThrow(userId, "User not found");
        if (!user.resume)
            throw new errors_1.NotFoundError("No resume found");
        await (0, upload_service_1.deleteCloudinaryAsset)(user.resume);
        const updated = await user_repository_1.userRepository.updateById(userId, {
            $set: { resume: "", updatedAt: new Date() },
            $unset: { resume: "" },
        });
        return (0, helpers_1.omitPassword)(updated);
    }
    async clearSearchHistory(userId) {
        const updated = await user_repository_1.userRepository.updateById(userId, {
            $set: { searchHistory: [], updatedAt: new Date() },
        });
        return (0, helpers_1.omitPassword)(updated);
    }
    async clearRecentlyViewed(userId) {
        const updated = await user_repository_1.userRepository.updateById(userId, {
            $set: { recentlyViewedJobs: [], updatedAt: new Date() },
        });
        return (0, helpers_1.omitPassword)(updated);
    }
    async getRecentlyViewedJobs(userId) {
        const user = await user_repository_1.userRepository.findByIdOrThrow(userId, "User not found");
        return user.recentlyViewedJobs || [];
    }
}
exports.UserService = UserService;
exports.userService = new UserService();
//# sourceMappingURL=user.service.js.map