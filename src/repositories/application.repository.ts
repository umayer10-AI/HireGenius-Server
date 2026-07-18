import { ObjectId, type Filter } from "mongodb";
import { BaseRepository } from "./base.repository";
import { COLLECTIONS } from "../constants";
import type { ApplicationDocument } from "../interfaces/models";

export class ApplicationRepository extends BaseRepository<ApplicationDocument> {
  constructor() {
    super(COLLECTIONS.APPLICATIONS);
  }

  async list(params: {
    page: number;
    limit: number;
    search?: string;
    status?: string;
    jobId?: string;
    candidateId?: string;
    sort?: string;
  }) {
    const filter: Filter<ApplicationDocument> = {};
    if (params.status) {
      filter.status = params.status as ApplicationDocument["status"];
    }
    if (params.jobId && ObjectId.isValid(params.jobId)) {
      filter.jobId = new ObjectId(params.jobId);
    }
    if (params.candidateId && ObjectId.isValid(params.candidateId)) {
      filter.candidateId = new ObjectId(params.candidateId);
    }

    const sortMap: Record<string, Record<string, 1 | -1>> = {
      newest: { createdAt: -1 },
      oldest: { createdAt: 1 },
    };

    return this.paginate(
      filter,
      params.page,
      params.limit,
      sortMap[params.sort || "newest"] || { createdAt: -1 }
    );
  }

  async findExisting(jobId: ObjectId, candidateId: ObjectId): Promise<ApplicationDocument | null> {
    return this.findOne({ jobId, candidateId } as Filter<ApplicationDocument>);
  }

  async countByJob(jobId: ObjectId): Promise<number> {
    return this.count({ jobId } as Filter<ApplicationDocument>);
  }

  async countByCandidate(candidateId: ObjectId): Promise<number> {
    return this.count({ candidateId } as Filter<ApplicationDocument>);
  }
}

export const applicationRepository = new ApplicationRepository();
