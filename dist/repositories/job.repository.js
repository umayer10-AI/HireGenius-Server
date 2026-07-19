import { ObjectId } from "mongodb";
import { BaseRepository } from "./base.repository.js";
import { COLLECTIONS } from "../constants/index.js";
export class JobRepository extends BaseRepository {
    constructor() {
        super(COLLECTIONS.JOBS);
    }
    buildFilter(params) {
        const filter = {};
        if (params.status && params.status !== "all") {
            filter.status = params.status;
        }
        else if (!params.createdBy) {
            // Public listings default to active; recruiter "mine" can see all statuses
            filter.status = "active";
        }
        if (params.category)
            filter.category = params.category;
        if (params.experience)
            filter.experience = params.experience;
        if (params.jobType)
            filter.jobType = params.jobType;
        if (params.workMode)
            filter.workMode = params.workMode;
        if (params.featured !== undefined)
            filter.featured = params.featured;
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
                filter["salary.max"] = {
                    ...filter["salary.max"],
                    $gte: params.minSalary,
                };
            }
            if (params.maxSalary !== undefined) {
                filter["salary.min"] = {
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
    getSort(sort) {
        const map = {
            newest: { createdAt: -1 },
            oldest: { createdAt: 1 },
            "salary-high": { "salary.max": -1 },
            "salary-low": { "salary.min": 1 },
            deadline: { applicationDeadline: 1 },
            alphabetical: { title: 1 },
        };
        return map[sort || "newest"] || { createdAt: -1 };
    }
    async list(params) {
        const filter = this.buildFilter(params);
        return this.paginate(filter, params.page, params.limit, this.getSort(params.sort));
    }
    async findBySlug(slug) {
        return this.findOne({ slug });
    }
    async incrementViews(id) {
        await this.collection.updateOne({ _id: id }, { $inc: { views: 1 } });
    }
    async countByCompany(companyId, status) {
        const filter = { companyId };
        if (status)
            filter.status = status;
        return this.count(filter);
    }
}
export const jobRepository = new JobRepository();
//# sourceMappingURL=job.repository.js.map