import { ObjectId, type Filter } from "mongodb";
import { BaseRepository } from "./base.repository";
import { COLLECTIONS } from "../constants";
import type { JobDocument } from "../interfaces/models";

export interface JobListParams {
  page: number;
  limit: number;
  search?: string;
  category?: string;
  location?: string;
  experience?: string;
  jobType?: string;
  workMode?: string;
  companyId?: string;
  minSalary?: number;
  maxSalary?: number;
  featured?: boolean;
  status?: string;
  skills?: string;
  sort?: string;
  createdBy?: string;
}

export class JobRepository extends BaseRepository<JobDocument> {
  constructor() {
    super(COLLECTIONS.JOBS);
  }

  buildFilter(params: JobListParams): Filter<JobDocument> {
    const filter: Filter<JobDocument> = {};

    if (params.status && params.status !== "all") {
      filter.status = params.status as JobDocument["status"];
    } else if (!params.createdBy) {
      // Public listings default to active; recruiter "mine" can see all statuses
      filter.status = "active";
    }

    if (params.category) filter.category = params.category;
    if (params.experience) filter.experience = params.experience;
    if (params.jobType) filter.jobType = params.jobType as JobDocument["jobType"];
    if (params.workMode) filter.workMode = params.workMode as JobDocument["workMode"];
    if (params.featured !== undefined) filter.featured = params.featured;
    if (params.companyId && ObjectId.isValid(params.companyId)) {
      filter.companyId = new ObjectId(params.companyId);
    }
    if (params.createdBy && ObjectId.isValid(params.createdBy)) {
      filter.createdBy = new ObjectId(params.createdBy);
    }
    if (params.location) {
      filter.location = { $regex: params.location, $options: "i" };
    }
    if (params.minSalary !== undefined || params.maxSalary !== undefined) {
      filter["salary.min"] = {};
      if (params.minSalary !== undefined) {
        (filter["salary.max"] as Record<string, number>) = {
          ...(filter["salary.max"] as Record<string, number>),
          $gte: params.minSalary,
        };
      }
      if (params.maxSalary !== undefined) {
        (filter["salary.min"] as Record<string, number>) = {
          $lte: params.maxSalary,
        };
      }
    }
    if (params.skills) {
      const skillList = params.skills.split(",").map((s) => s.trim()).filter(Boolean);
      if (skillList.length) {
        filter.skills = { $in: skillList };
      }
    }
    if (params.search) {
      filter.$or = [
        { title: { $regex: params.search, $options: "i" } },
        { shortDescription: { $regex: params.search, $options: "i" } },
        { location: { $regex: params.search, $options: "i" } },
        { skills: { $elemMatch: { $regex: params.search, $options: "i" } } },
        { category: { $regex: params.search, $options: "i" } },
      ];
    }

    return filter;
  }

  getSort(sort?: string): Record<string, 1 | -1> {
    const map: Record<string, Record<string, 1 | -1>> = {
      newest: { createdAt: -1 },
      oldest: { createdAt: 1 },
      "salary-high": { "salary.max": -1 },
      "salary-low": { "salary.min": 1 },
      deadline: { applicationDeadline: 1 },
      alphabetical: { title: 1 },
    };
    return map[sort || "newest"] || { createdAt: -1 };
  }

  async list(params: JobListParams) {
    const filter = this.buildFilter(params);
    return this.paginate(filter, params.page, params.limit, this.getSort(params.sort));
  }

  async findBySlug(slug: string): Promise<JobDocument | null> {
    return this.findOne({ slug } as Filter<JobDocument>);
  }

  async incrementViews(id: ObjectId): Promise<void> {
    await this.collection.updateOne({ _id: id }, { $inc: { views: 1 } });
  }

  async countByCompany(companyId: ObjectId, status?: string): Promise<number> {
    const filter: Filter<JobDocument> = { companyId };
    if (status) filter.status = status as JobDocument["status"];
    return this.count(filter);
  }
}

export const jobRepository = new JobRepository();
