import { ObjectId } from "mongodb";
import { BaseRepository } from "./base.repository.js";
import { COLLECTIONS } from "../constants/index.js";
export class ApplicationRepository extends BaseRepository {
    constructor() {
        super(COLLECTIONS.APPLICATIONS);
    }
    async list(params) {
        const filter = {};
        if (params.status) {
            filter.status = params.status;
        }
        if (params.jobId && ObjectId.isValid(params.jobId)) {
            filter.jobId = new ObjectId(params.jobId);
        }
        if (params.candidateId && ObjectId.isValid(params.candidateId)) {
            filter.candidateId = new ObjectId(params.candidateId);
        }
        const sortMap = {
            newest: { createdAt: -1 },
            oldest: { createdAt: 1 },
        };
        return this.paginate(filter, params.page, params.limit, sortMap[params.sort || "newest"] || { createdAt: -1 });
    }
    async findExisting(jobId, candidateId) {
        return this.findOne({ jobId, candidateId });
    }
    async countByJob(jobId) {
        return this.count({ jobId });
    }
    async countByCandidate(candidateId) {
        return this.count({ candidateId });
    }
}
export const applicationRepository = new ApplicationRepository();
//# sourceMappingURL=application.repository.js.map