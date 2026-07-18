"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.companyService = exports.CompanyService = void 0;
const company_repository_1 = require("../repositories/company.repository");
const job_repository_1 = require("../repositories/job.repository");
const errors_1 = require("../utils/errors");
const response_1 = require("../utils/response");
const upload_service_1 = require("./upload.service");
class CompanyService {
    async create(data, owner) {
        if (!owner._id)
            throw new errors_1.ForbiddenError("Invalid user");
        const now = new Date();
        return company_repository_1.companyRepository.insertOne({
            ...data,
            ownerId: owner._id,
            verified: false,
            rating: 0,
            reviewCount: 0,
            createdAt: now,
            updatedAt: now,
        });
    }
    async list(params) {
        const { data, total } = await company_repository_1.companyRepository.list(params);
        const withJobCounts = await Promise.all(data.map(async (company) => {
            const openJobs = company._id
                ? await job_repository_1.jobRepository.countByCompany(company._id, "active")
                : 0;
            return { ...company, openJobs };
        }));
        return {
            data: withJobCounts,
            meta: (0, response_1.buildPaginationMeta)(params.page, params.limit, total),
        };
    }
    async getById(id) {
        const company = await company_repository_1.companyRepository.findByIdOrThrow(id, "Company not found");
        const openJobs = company._id
            ? await job_repository_1.jobRepository.countByCompany(company._id, "active")
            : 0;
        return { ...company, openJobs };
    }
    async update(id, updates, requester) {
        const company = await company_repository_1.companyRepository.findByIdOrThrow(id, "Company not found");
        if (requester.role !== "admin" &&
            company.ownerId.toString() !== requester._id?.toString()) {
            throw new errors_1.ForbiddenError("You can only update your own company");
        }
        return company_repository_1.companyRepository.updateById(id, {
            $set: { ...updates, updatedAt: new Date() },
        });
    }
    async remove(id, requester) {
        const company = await company_repository_1.companyRepository.findByIdOrThrow(id, "Company not found");
        if (requester.role !== "admin" &&
            company.ownerId.toString() !== requester._id?.toString()) {
            throw new errors_1.ForbiddenError("You can only delete your own company");
        }
        await company_repository_1.companyRepository.deleteById(id);
        return { deleted: true };
    }
    async uploadLogo(id, file, requester) {
        const company = await company_repository_1.companyRepository.findByIdOrThrow(id, "Company not found");
        if (requester.role !== "admin" &&
            company.ownerId.toString() !== requester._id?.toString()) {
            throw new errors_1.ForbiddenError("Forbidden");
        }
        const uploaded = await (0, upload_service_1.uploadBufferToCloudinary)(file.buffer, "companies/logos", "image");
        if (company.logo)
            await (0, upload_service_1.deleteCloudinaryAsset)(company.logo);
        return company_repository_1.companyRepository.updateById(id, {
            $set: { logo: uploaded.secure_url, updatedAt: new Date() },
        });
    }
    async uploadBanner(id, file, requester) {
        const company = await company_repository_1.companyRepository.findByIdOrThrow(id, "Company not found");
        if (requester.role !== "admin" &&
            company.ownerId.toString() !== requester._id?.toString()) {
            throw new errors_1.ForbiddenError("Forbidden");
        }
        const uploaded = await (0, upload_service_1.uploadBufferToCloudinary)(file.buffer, "companies/banners", "image");
        if (company.banner)
            await (0, upload_service_1.deleteCloudinaryAsset)(company.banner);
        return company_repository_1.companyRepository.updateById(id, {
            $set: { banner: uploaded.secure_url, updatedAt: new Date() },
        });
    }
    async getMine(ownerId) {
        return company_repository_1.companyRepository.findByOwner(ownerId);
    }
}
exports.CompanyService = CompanyService;
exports.companyService = new CompanyService();
//# sourceMappingURL=company.service.js.map