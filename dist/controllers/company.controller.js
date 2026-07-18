"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMyCompanies = exports.uploadCompanyBanner = exports.uploadCompanyLogo = exports.deleteCompany = exports.updateCompany = exports.getCompany = exports.listCompanies = exports.createCompany = void 0;
const error_middleware_1 = require("../middlewares/error.middleware");
const company_service_1 = require("../services/company.service");
const response_1 = require("../utils/response");
exports.createCompany = (0, error_middleware_1.asyncHandler)(async (req, res) => {
    const data = await company_service_1.companyService.create(req.body, req.user);
    return (0, response_1.sendSuccess)(res, data, "Company created", 201);
});
exports.listCompanies = (0, error_middleware_1.asyncHandler)(async (req, res) => {
    const result = await company_service_1.companyService.list(req.query);
    return (0, response_1.sendSuccess)(res, result.data, "Companies fetched", 200, result.meta);
});
exports.getCompany = (0, error_middleware_1.asyncHandler)(async (req, res) => {
    const data = await company_service_1.companyService.getById(req.params.id);
    return (0, response_1.sendSuccess)(res, data, "Company fetched");
});
exports.updateCompany = (0, error_middleware_1.asyncHandler)(async (req, res) => {
    const data = await company_service_1.companyService.update(req.params.id, req.body, req.user);
    return (0, response_1.sendSuccess)(res, data, "Company updated");
});
exports.deleteCompany = (0, error_middleware_1.asyncHandler)(async (req, res) => {
    const data = await company_service_1.companyService.remove(req.params.id, req.user);
    return (0, response_1.sendSuccess)(res, data, "Company deleted");
});
exports.uploadCompanyLogo = (0, error_middleware_1.asyncHandler)(async (req, res) => {
    const data = await company_service_1.companyService.uploadLogo(req.params.id, req.file, req.user);
    return (0, response_1.sendSuccess)(res, data, "Logo uploaded");
});
exports.uploadCompanyBanner = (0, error_middleware_1.asyncHandler)(async (req, res) => {
    const data = await company_service_1.companyService.uploadBanner(req.params.id, req.file, req.user);
    return (0, response_1.sendSuccess)(res, data, "Banner uploaded");
});
exports.getMyCompanies = (0, error_middleware_1.asyncHandler)(async (req, res) => {
    const data = await company_service_1.companyService.getMine(req.user._id);
    return (0, response_1.sendSuccess)(res, data, "Your companies fetched");
});
//# sourceMappingURL=company.controller.js.map