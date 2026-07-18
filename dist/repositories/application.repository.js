"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.applicationRepository = exports.ApplicationRepository = void 0;
const mongodb_1 = require("mongodb");
const base_repository_1 = require("./base.repository");
const constants_1 = require("../constants");
class ApplicationRepository extends base_repository_1.BaseRepository {
    constructor() {
        super(constants_1.COLLECTIONS.APPLICATIONS);
    }
    async list(params) {
        const filter = {};
        if (params.status) {
            filter.status = params.status;
        }
        if (params.jobId && mongodb_1.ObjectId.isValid(params.jobId)) {
            filter.jobId = new mongodb_1.ObjectId(params.jobId);
        }
        if (params.candidateId && mongodb_1.ObjectId.isValid(params.candidateId)) {
            filter.candidateId = new mongodb_1.ObjectId(params.candidateId);
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
exports.ApplicationRepository = ApplicationRepository;
exports.applicationRepository = new ApplicationRepository();
//# sourceMappingURL=application.repository.js.map