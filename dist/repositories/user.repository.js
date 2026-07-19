import { BaseRepository } from "./base.repository.js";
import { COLLECTIONS } from "../constants/index.js";
export class UserRepository extends BaseRepository {
    constructor() {
        super(COLLECTIONS.USERS);
    }
    async findByEmail(email) {
        return this.findOne({ email: email.toLowerCase() });
    }
    async findByBetterAuthId(id) {
        return this.findOne({ betterAuthUserId: id });
    }
    async listUsers(params) {
        const filter = {};
        if (params.role) {
            filter.role = params.role;
        }
        if (params.search) {
            filter.$or = [
                { name: { $regex: params.search, $options: "i" } },
                { email: { $regex: params.search, $options: "i" } },
            ];
        }
        const sortMap = {
            newest: { createdAt: -1 },
            oldest: { createdAt: 1 },
            alphabetical: { name: 1 },
        };
        return this.paginate(filter, params.page, params.limit, sortMap[params.sort || "newest"] || {
            createdAt: -1,
        });
    }
    async pushSavedJob(userId, jobId) {
        await this.collection.updateOne({ _id: userId }, { $addToSet: { savedJobs: jobId }, $set: { updatedAt: new Date() } });
    }
    async pullSavedJob(userId, jobId) {
        await this.collection.updateOne({ _id: userId }, { $pull: { savedJobs: jobId }, $set: { updatedAt: new Date() } });
    }
    async pushAppliedJob(userId, jobId) {
        await this.collection.updateOne({ _id: userId }, { $addToSet: { appliedJobs: jobId }, $set: { updatedAt: new Date() } });
    }
    async addRecentlyViewed(userId, jobId) {
        await this.collection.updateOne({ _id: userId }, {
            $pull: { recentlyViewedJobs: jobId },
        });
        await this.collection.updateOne({ _id: userId }, {
            $push: {
                recentlyViewedJobs: {
                    $each: [jobId],
                    $position: 0,
                    $slice: 20,
                },
            },
            $set: { updatedAt: new Date() },
        });
    }
    async addSearchHistory(userId, term) {
        const cleaned = term.trim();
        if (!cleaned)
            return;
        await this.collection.updateOne({ _id: userId }, {
            $pull: { searchHistory: cleaned },
        });
        await this.collection.updateOne({ _id: userId }, {
            $push: {
                searchHistory: {
                    $each: [cleaned],
                    $position: 0,
                    $slice: 10,
                },
            },
            $set: { updatedAt: new Date() },
        });
    }
}
export const userRepository = new UserRepository();
//# sourceMappingURL=user.repository.js.map