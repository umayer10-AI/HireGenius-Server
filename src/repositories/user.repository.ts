import { ObjectId, type Filter } from "mongodb";
import { BaseRepository } from "./base.repository.js";
import { COLLECTIONS } from "../constants/index.js";
import type { UserDocument } from "../interfaces/models.js";

export class UserRepository extends BaseRepository<UserDocument> {
  constructor() {
    super(COLLECTIONS.USERS);
  }

  async findByEmail(email: string): Promise<UserDocument | null> {
    return this.findOne({ email: email.toLowerCase() } as Filter<UserDocument>);
  }

  async findByBetterAuthId(id: string): Promise<UserDocument | null> {
    return this.findOne({ betterAuthUserId: id } as Filter<UserDocument>);
  }

  async listUsers(params: {
    page: number;
    limit: number;
    search?: string;
    role?: string;
    sort?: string;
  }) {
    const filter: Filter<UserDocument> = {};
    if (params.role) {
      filter.role = params.role as UserDocument["role"];
    }
    if (params.search) {
      filter.$or = [
        { name: { $regex: params.search, $options: "i" } },
        { email: { $regex: params.search, $options: "i" } },
      ];
    }
    const sortMap: Record<string, Record<string, 1 | -1>> = {
      newest: { createdAt: -1 },
      oldest: { createdAt: 1 },
      alphabetical: { name: 1 },
    };
    return this.paginate(filter, params.page, params.limit, sortMap[params.sort || "newest"] || {
      createdAt: -1,
    });
  }

  async pushSavedJob(userId: ObjectId, jobId: ObjectId): Promise<void> {
    await this.collection.updateOne(
      { _id: userId },
      { $addToSet: { savedJobs: jobId }, $set: { updatedAt: new Date() } }
    );
  }

  async pullSavedJob(userId: ObjectId, jobId: ObjectId): Promise<void> {
    await this.collection.updateOne(
      { _id: userId },
      { $pull: { savedJobs: jobId }, $set: { updatedAt: new Date() } }
    );
  }

  async pushAppliedJob(userId: ObjectId, jobId: ObjectId): Promise<void> {
    await this.collection.updateOne(
      { _id: userId },
      { $addToSet: { appliedJobs: jobId }, $set: { updatedAt: new Date() } }
    );
  }

  async addRecentlyViewed(userId: ObjectId, jobId: ObjectId): Promise<void> {
    await this.collection.updateOne(
      { _id: userId },
      {
        $pull: { recentlyViewedJobs: jobId },
      }
    );
    await this.collection.updateOne(
      { _id: userId },
      {
        $push: {
          recentlyViewedJobs: {
            $each: [jobId],
            $position: 0,
            $slice: 20,
          },
        },
        $set: { updatedAt: new Date() },
      }
    );
  }

  async addSearchHistory(userId: ObjectId, term: string): Promise<void> {
    const cleaned = term.trim();
    if (!cleaned) return;
    await this.collection.updateOne(
      { _id: userId },
      {
        $pull: { searchHistory: cleaned },
      }
    );
    await this.collection.updateOne(
      { _id: userId },
      {
        $push: {
          searchHistory: {
            $each: [cleaned],
            $position: 0,
            $slice: 10,
          },
        },
        $set: { updatedAt: new Date() },
      }
    );
  }
}

export const userRepository = new UserRepository();
