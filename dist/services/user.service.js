import { userRepository } from "../repositories/user.repository.js";
import { ConflictError, ForbiddenError, NotFoundError } from "../utils/errors.js";
import { calculateProfileCompletion, omitPassword } from "../utils/helpers.js";
import { deleteCloudinaryAsset, uploadBufferToCloudinary } from "./upload.service.js";
import { buildPaginationMeta } from "../utils/response.js";
export class UserService {
    async getMe(user) {
        const completion = calculateProfileCompletion(user);
        return {
            ...omitPassword(user),
            profileCompletion: completion,
        };
    }
    async getById(id, requester) {
        const user = await userRepository.findByIdOrThrow(id, "User not found");
        if (requester &&
            requester.role !== "admin" &&
            requester._id?.toString() !== id &&
            user.privacy?.publicProfile === false) {
            throw new ForbiddenError("This profile is private");
        }
        return omitPassword(user);
    }
    async list(params) {
        const { data, total } = await userRepository.listUsers(params);
        return {
            data: data.map(omitPassword),
            meta: buildPaginationMeta(params.page, params.limit, total),
        };
    }
    async update(id, updates, requester) {
        if (requester.role !== "admin" && requester._id?.toString() !== id) {
            throw new ForbiddenError("You can only update your own profile");
        }
        if (updates.role) {
            const isSelf = requester._id?.toString() === id;
            const requestedRole = updates.role;
            const canSelfAssign = isSelf &&
                (requestedRole === "candidate" || requestedRole === "recruiter") &&
                requester.role !== "admin";
            if (requester.role !== "admin" && !canSelfAssign) {
                delete updates.role;
            }
            if (requestedRole === "admin" && requester.role !== "admin") {
                delete updates.role;
            }
        }
        if (updates.isPremium !== undefined && requester.role !== "admin") {
            delete updates.isPremium;
        }
        if (updates.isVerified !== undefined && requester.role !== "admin") {
            delete updates.isVerified;
        }
        if (updates.email) {
            const existing = await userRepository.findByEmail(updates.email);
            if (existing && existing._id?.toString() !== id) {
                throw new ConflictError("Email already in use");
            }
            updates.email = updates.email.toLowerCase();
        }
        const updated = await userRepository.updateById(id, {
            $set: { ...updates, updatedAt: new Date() },
        });
        return omitPassword(updated);
    }
    async setMyRole(user, role) {
        if (!user._id)
            throw new ForbiddenError("Invalid user");
        if (user.role === "admin") {
            throw new ForbiddenError("Admin role cannot be changed here");
        }
        const updated = await userRepository.updateById(user._id.toString(), {
            $set: { role, updatedAt: new Date() },
        });
        return omitPassword(updated);
    }
    async remove(id, requester) {
        if (requester.role !== "admin" && requester._id?.toString() !== id) {
            throw new ForbiddenError("You can only delete your own account");
        }
        await userRepository.deleteById(id, "User not found");
        return { deleted: true };
    }
    async uploadAvatar(userId, file) {
        const user = await userRepository.findByIdOrThrow(userId, "User not found");
        const uploaded = await uploadBufferToCloudinary(file.buffer, "avatars", "image");
        if (user.image) {
            await deleteCloudinaryAsset(user.image);
        }
        const updated = await userRepository.updateById(userId, {
            $set: { image: uploaded.secure_url, updatedAt: new Date() },
        });
        return omitPassword(updated);
    }
    async uploadResume(userId, file) {
        const user = await userRepository.findByIdOrThrow(userId, "User not found");
        const uploaded = await uploadBufferToCloudinary(file.buffer, "resumes", "raw");
        if (user.resume) {
            await deleteCloudinaryAsset(user.resume);
        }
        const updated = await userRepository.updateById(userId, {
            $set: { resume: uploaded.secure_url, updatedAt: new Date() },
        });
        return omitPassword(updated);
    }
    async deleteResume(userId) {
        const user = await userRepository.findByIdOrThrow(userId, "User not found");
        if (!user.resume)
            throw new NotFoundError("No resume found");
        await deleteCloudinaryAsset(user.resume);
        const updated = await userRepository.updateById(userId, {
            $set: { resume: "", updatedAt: new Date() },
            $unset: { resume: "" },
        });
        return omitPassword(updated);
    }
    async clearSearchHistory(userId) {
        const updated = await userRepository.updateById(userId, {
            $set: { searchHistory: [], updatedAt: new Date() },
        });
        return omitPassword(updated);
    }
    async clearRecentlyViewed(userId) {
        const updated = await userRepository.updateById(userId, {
            $set: { recentlyViewedJobs: [], updatedAt: new Date() },
        });
        return omitPassword(updated);
    }
    async getRecentlyViewedJobs(userId) {
        const user = await userRepository.findByIdOrThrow(userId, "User not found");
        return user.recentlyViewedJobs || [];
    }
}
export const userService = new UserService();
//# sourceMappingURL=user.service.js.map