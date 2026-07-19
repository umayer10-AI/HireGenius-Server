import { ObjectId, type Filter } from "mongodb";
import { BaseRepository } from "./base.repository.js";
import { COLLECTIONS } from "../constants/index.js";
import type { CompanyDocument } from "../interfaces/models.js";

export class CompanyRepository extends BaseRepository<CompanyDocument> {
  constructor() {
    super(COLLECTIONS.COMPANIES);
  }

  async list(params: {
    page: number;
    limit: number;
    search?: string;
    industry?: string;
    location?: string;
    sort?: string;
  }) {
    const filter: Filter<CompanyDocument> = {};
    if (params.industry) filter.industry = params.industry;
    if (params.location) {
      filter.location = { $regex: params.location, $options: "i" };
    }
    if (params.search) {
      filter.$or = [
        { companyName: { $regex: params.search, $options: "i" } },
        { description: { $regex: params.search, $options: "i" } },
        { industry: { $regex: params.search, $options: "i" } },
      ];
    }
    const sortMap: Record<string, Record<string, 1 | -1>> = {
      newest: { createdAt: -1 },
      oldest: { createdAt: 1 },
      alphabetical: { companyName: 1 },
      rating: { rating: -1 },
    };
    return this.paginate(
      filter,
      params.page,
      params.limit,
      sortMap[params.sort || "newest"] || { createdAt: -1 }
    );
  }

  async findByOwner(ownerId: ObjectId): Promise<CompanyDocument[]> {
    return this.findMany({ ownerId } as Filter<CompanyDocument>);
  }

  async updateRating(companyId: ObjectId, rating: number, reviewCount: number): Promise<void> {
    await this.collection.updateOne(
      { _id: companyId },
      { $set: { rating, reviewCount, updatedAt: new Date() } }
    );
  }
}

export const companyRepository = new CompanyRepository();
