"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.aiRepository = exports.notificationRepository = exports.blogRepository = exports.reviewRepository = exports.savedJobRepository = exports.AIRepository = exports.NotificationRepository = exports.BlogRepository = exports.ReviewRepository = exports.SavedJobRepository = void 0;
const mongodb_1 = require("mongodb");
const base_repository_1 = require("./base.repository");
const constants_1 = require("../constants");
class SavedJobRepository extends base_repository_1.BaseRepository {
    constructor() {
        super(constants_1.COLLECTIONS.SAVED_JOBS);
    }
    async listByUser(userId, page, limit) {
        return this.paginate({ userId }, page, limit, { createdAt: -1 });
    }
    async findExisting(userId, jobId) {
        return this.findOne({ userId, jobId });
    }
    async deleteByUserAndJob(userId, jobId) {
        const result = await this.collection.deleteOne({ userId, jobId });
        return result.deletedCount > 0;
    }
}
exports.SavedJobRepository = SavedJobRepository;
class ReviewRepository extends base_repository_1.BaseRepository {
    constructor() {
        super(constants_1.COLLECTIONS.REVIEWS);
    }
    async list(params) {
        const filter = {};
        if (params.companyId && mongodb_1.ObjectId.isValid(params.companyId)) {
            filter.companyId = new mongodb_1.ObjectId(params.companyId);
        }
        return this.paginate(filter, params.page, params.limit, { createdAt: -1 });
    }
    async findExisting(userId, companyId) {
        return this.findOne({ userId, companyId });
    }
    async getCompanyStats(companyId) {
        const result = await this.collection
            .aggregate([
            { $match: { companyId } },
            {
                $group: {
                    _id: null,
                    avg: { $avg: "$rating" },
                    count: { $sum: 1 },
                },
            },
        ])
            .toArray();
        if (!result[0])
            return { avg: 0, count: 0 };
        return { avg: Math.round(result[0].avg * 10) / 10, count: result[0].count };
    }
}
exports.ReviewRepository = ReviewRepository;
class BlogRepository extends base_repository_1.BaseRepository {
    constructor() {
        super(constants_1.COLLECTIONS.BLOGS);
    }
    async list(params) {
        const filter = {};
        if (params.published !== undefined)
            filter.published = params.published;
        if (params.tag)
            filter.tags = params.tag;
        if (params.search) {
            filter.$or = [
                { title: { $regex: params.search, $options: "i" } },
                { description: { $regex: params.search, $options: "i" } },
                { tags: { $elemMatch: { $regex: params.search, $options: "i" } } },
            ];
        }
        const sortMap = {
            newest: { createdAt: -1 },
            oldest: { createdAt: 1 },
            alphabetical: { title: 1 },
        };
        return this.paginate(filter, params.page, params.limit, sortMap[params.sort || "newest"] || { createdAt: -1 });
    }
    async findBySlug(slug) {
        return this.findOne({ slug });
    }
}
exports.BlogRepository = BlogRepository;
class NotificationRepository extends base_repository_1.BaseRepository {
    constructor() {
        super(constants_1.COLLECTIONS.NOTIFICATIONS);
    }
    async listByUser(userId, page, limit) {
        return this.paginate({ receiverId: userId }, page, limit, { createdAt: -1 });
    }
    async unreadCount(userId) {
        return this.count({ receiverId: userId, isRead: false });
    }
    async markAllRead(userId) {
        const result = await this.collection.updateMany({ receiverId: userId, isRead: false }, { $set: { isRead: true, updatedAt: new Date() } });
        return result.modifiedCount;
    }
}
exports.NotificationRepository = NotificationRepository;
class AIRepository {
    chats = new base_repository_1.BaseRepository(constants_1.COLLECTIONS.AI_CHATS);
    resumes = new base_repository_1.BaseRepository(constants_1.COLLECTIONS.RESUME_GENERATIONS);
    async createChat(doc) {
        return this.chats.insertOne(doc);
    }
    async getChat(id) {
        return this.chats.findById(id);
    }
    async listChats(userId, page, limit) {
        return this.chats.paginate({ userId }, page, limit, { updatedAt: -1 });
    }
    async updateChat(id, update) {
        return this.chats.updateById(id, { $set: { ...update, updatedAt: new Date() } });
    }
    async deleteChat(id) {
        return this.chats.deleteById(id);
    }
    async saveResumeGeneration(doc) {
        return this.resumes.insertOne(doc);
    }
    async listResumeGenerations(userId, page, limit) {
        return this.resumes.paginate({ userId }, page, limit, { createdAt: -1 });
    }
}
exports.AIRepository = AIRepository;
exports.savedJobRepository = new SavedJobRepository();
exports.reviewRepository = new ReviewRepository();
exports.blogRepository = new BlogRepository();
exports.notificationRepository = new NotificationRepository();
exports.aiRepository = new AIRepository();
//# sourceMappingURL=index.js.map