"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.companyRepository = exports.CompanyRepository = void 0;
const base_repository_1 = require("./base.repository");
const constants_1 = require("../constants");
class CompanyRepository extends base_repository_1.BaseRepository {
    constructor() {
        super(constants_1.COLLECTIONS.COMPANIES);
    }
    async list(params) {
        const filter = {};
        if (params.industry)
            filter.industry = params.industry;
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
        const sortMap = {
            newest: { createdAt: -1 },
            oldest: { createdAt: 1 },
            alphabetical: { companyName: 1 },
            rating: { rating: -1 },
        };
        return this.paginate(filter, params.page, params.limit, sortMap[params.sort || "newest"] || { createdAt: -1 });
    }
    async findByOwner(ownerId) {
        return this.findMany({ ownerId });
    }
    async updateRating(companyId, rating, reviewCount) {
        await this.collection.updateOne({ _id: companyId }, { $set: { rating, reviewCount, updatedAt: new Date() } });
    }
}
exports.CompanyRepository = CompanyRepository;
exports.companyRepository = new CompanyRepository();
//# sourceMappingURL=company.repository.js.map