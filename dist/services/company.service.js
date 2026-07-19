import { companyRepository } from "../repositories/company.repository.js";
import { jobRepository } from "../repositories/job.repository.js";
import { ForbiddenError } from "../utils/errors.js";
import { buildPaginationMeta } from "../utils/response.js";
import { deleteCloudinaryAsset, uploadBufferToCloudinary } from "./upload.service.js";
export class CompanyService {
    async create(data, owner) {
        if (!owner._id)
            throw new ForbiddenError("Invalid user");
        const now = new Date();
        return companyRepository.insertOne({
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
        const { data, total } = await companyRepository.list(params);
        const withJobCounts = await Promise.all(data.map(async (company) => {
            const openJobs = company._id
                ? await jobRepository.countByCompany(company._id, "active")
                : 0;
            return { ...company, openJobs };
        }));
        return {
            data: withJobCounts,
            meta: buildPaginationMeta(params.page, params.limit, total),
        };
    }
    async getById(id) {
        const company = await companyRepository.findByIdOrThrow(id, "Company not found");
        const openJobs = company._id
            ? await jobRepository.countByCompany(company._id, "active")
            : 0;
        return { ...company, openJobs };
    }
    async update(id, updates, requester) {
        const company = await companyRepository.findByIdOrThrow(id, "Company not found");
        if (requester.role !== "admin" &&
            company.ownerId.toString() !== requester._id?.toString()) {
            throw new ForbiddenError("You can only update your own company");
        }
        return companyRepository.updateById(id, {
            $set: { ...updates, updatedAt: new Date() },
        });
    }
    async remove(id, requester) {
        const company = await companyRepository.findByIdOrThrow(id, "Company not found");
        if (requester.role !== "admin" &&
            company.ownerId.toString() !== requester._id?.toString()) {
            throw new ForbiddenError("You can only delete your own company");
        }
        await companyRepository.deleteById(id);
        return { deleted: true };
    }
    async uploadLogo(id, file, requester) {
        const company = await companyRepository.findByIdOrThrow(id, "Company not found");
        if (requester.role !== "admin" &&
            company.ownerId.toString() !== requester._id?.toString()) {
            throw new ForbiddenError("Forbidden");
        }
        const uploaded = await uploadBufferToCloudinary(file.buffer, "companies/logos", "image");
        if (company.logo)
            await deleteCloudinaryAsset(company.logo);
        return companyRepository.updateById(id, {
            $set: { logo: uploaded.secure_url, updatedAt: new Date() },
        });
    }
    async uploadBanner(id, file, requester) {
        const company = await companyRepository.findByIdOrThrow(id, "Company not found");
        if (requester.role !== "admin" &&
            company.ownerId.toString() !== requester._id?.toString()) {
            throw new ForbiddenError("Forbidden");
        }
        const uploaded = await uploadBufferToCloudinary(file.buffer, "companies/banners", "image");
        if (company.banner)
            await deleteCloudinaryAsset(company.banner);
        return companyRepository.updateById(id, {
            $set: { banner: uploaded.secure_url, updatedAt: new Date() },
        });
    }
    async getMine(ownerId) {
        return companyRepository.findByOwner(ownerId);
    }
}
export const companyService = new CompanyService();
//# sourceMappingURL=company.service.js.map