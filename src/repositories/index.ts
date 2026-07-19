import { ObjectId, type Filter } from "mongodb";
import { BaseRepository } from "./base.repository.js";
import { COLLECTIONS } from "../constants/index.js";
import type {
  AIChatDocument,
  BlogDocument,
  NotificationDocument,
  ResumeGenerationDocument,
  ReviewDocument,
  SavedJobDocument,
} from "../interfaces/models.js";

export class SavedJobRepository extends BaseRepository<SavedJobDocument> {
  constructor() {
    super(COLLECTIONS.SAVED_JOBS);
  }

  async listByUser(userId: ObjectId, page: number, limit: number) {
    return this.paginate(
      { userId } as Filter<SavedJobDocument>,
      page,
      limit,
      { createdAt: -1 }
    );
  }

  async findExisting(userId: ObjectId, jobId: ObjectId): Promise<SavedJobDocument | null> {
    return this.findOne({ userId, jobId } as Filter<SavedJobDocument>);
  }

  async deleteByUserAndJob(userId: ObjectId, jobId: ObjectId): Promise<boolean> {
    const result = await this.collection.deleteOne({ userId, jobId });
    return result.deletedCount > 0;
  }
}

export class ReviewRepository extends BaseRepository<ReviewDocument> {
  constructor() {
    super(COLLECTIONS.REVIEWS);
  }

  async list(params: {
    page: number;
    limit: number;
    companyId?: string;
  }) {
    const filter: Filter<ReviewDocument> = {};
    if (params.companyId && ObjectId.isValid(params.companyId)) {
      filter.companyId = new ObjectId(params.companyId);
    }
    return this.paginate(filter, params.page, params.limit, { createdAt: -1 });
  }

  async findExisting(userId: ObjectId, companyId: ObjectId): Promise<ReviewDocument | null> {
    return this.findOne({ userId, companyId } as Filter<ReviewDocument>);
  }

  async getCompanyStats(companyId: ObjectId): Promise<{ avg: number; count: number }> {
    const result = await this.collection
      .aggregate<{ avg: number; count: number }>([
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
    if (!result[0]) return { avg: 0, count: 0 };
    return { avg: Math.round(result[0].avg * 10) / 10, count: result[0].count };
  }
}

export class BlogRepository extends BaseRepository<BlogDocument> {
  constructor() {
    super(COLLECTIONS.BLOGS);
  }

  async list(params: {
    page: number;
    limit: number;
    search?: string;
    tag?: string;
    published?: boolean;
    sort?: string;
  }) {
    const filter: Filter<BlogDocument> = {};
    if (params.published !== undefined) filter.published = params.published;
    if (params.tag) filter.tags = params.tag;
    if (params.search) {
      filter.$or = [
        { title: { $regex: params.search, $options: "i" } },
        { description: { $regex: params.search, $options: "i" } },
        { tags: { $elemMatch: { $regex: params.search, $options: "i" } } },
      ];
    }
    const sortMap: Record<string, Record<string, 1 | -1>> = {
      newest: { createdAt: -1 },
      oldest: { createdAt: 1 },
      alphabetical: { title: 1 },
    };
    return this.paginate(
      filter,
      params.page,
      params.limit,
      sortMap[params.sort || "newest"] || { createdAt: -1 }
    );
  }

  async findBySlug(slug: string): Promise<BlogDocument | null> {
    return this.findOne({ slug } as Filter<BlogDocument>);
  }
}

export class NotificationRepository extends BaseRepository<NotificationDocument> {
  constructor() {
    super(COLLECTIONS.NOTIFICATIONS);
  }

  async listByUser(userId: ObjectId, page: number, limit: number) {
    return this.paginate(
      { receiverId: userId } as Filter<NotificationDocument>,
      page,
      limit,
      { createdAt: -1 }
    );
  }

  async unreadCount(userId: ObjectId): Promise<number> {
    return this.count({ receiverId: userId, isRead: false } as Filter<NotificationDocument>);
  }

  async markAllRead(userId: ObjectId): Promise<number> {
    const result = await this.collection.updateMany(
      { receiverId: userId, isRead: false },
      { $set: { isRead: true, updatedAt: new Date() } }
    );
    return result.modifiedCount;
  }
}

export class AIRepository {
  private chats = new BaseRepository<AIChatDocument>(COLLECTIONS.AI_CHATS);
  private resumes = new BaseRepository<ResumeGenerationDocument>(COLLECTIONS.RESUME_GENERATIONS);

  async createChat(doc: AIChatDocument): Promise<AIChatDocument> {
    return this.chats.insertOne(doc);
  }

  async getChat(id: string): Promise<AIChatDocument | null> {
    return this.chats.findById(id);
  }

  async listChats(userId: ObjectId, page: number, limit: number) {
    return this.chats.paginate(
      { userId } as Filter<AIChatDocument>,
      page,
      limit,
      { updatedAt: -1 }
    );
  }

  async updateChat(id: string, update: Partial<AIChatDocument>): Promise<AIChatDocument> {
    return this.chats.updateById(id, { $set: { ...update, updatedAt: new Date() } });
  }

  async deleteChat(id: string): Promise<boolean> {
    return this.chats.deleteById(id);
  }

  async saveResumeGeneration(doc: ResumeGenerationDocument): Promise<ResumeGenerationDocument> {
    return this.resumes.insertOne(doc);
  }

  async listResumeGenerations(userId: ObjectId, page: number, limit: number) {
    return this.resumes.paginate(
      { userId } as Filter<ResumeGenerationDocument>,
      page,
      limit,
      { createdAt: -1 }
    );
  }
}

export const savedJobRepository = new SavedJobRepository();
export const reviewRepository = new ReviewRepository();
export const blogRepository = new BlogRepository();
export const notificationRepository = new NotificationRepository();
export const aiRepository = new AIRepository();
