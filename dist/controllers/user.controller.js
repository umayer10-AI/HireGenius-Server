"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setMyRole = exports.clearRecentlyViewed = exports.clearSearchHistory = exports.deleteResume = exports.uploadResume = exports.uploadAvatar = exports.deleteUser = exports.updateUser = exports.getUser = exports.listUsers = exports.getMe = void 0;
const error_middleware_1 = require("../middlewares/error.middleware");
const user_service_1 = require("../services/user.service");
const response_1 = require("../utils/response");
const helpers_1 = require("../utils/helpers");
exports.getMe = (0, error_middleware_1.asyncHandler)(async (req, res) => {
    const data = await user_service_1.userService.getMe(req.user);
    const completion = (0, helpers_1.calculateProfileCompletion)(req.user);
    return (0, response_1.sendSuccess)(res, { ...data, profileCompletion: completion }, "Profile fetched");
});
exports.listUsers = (0, error_middleware_1.asyncHandler)(async (req, res) => {
    const result = await user_service_1.userService.list(req.query);
    return (0, response_1.sendSuccess)(res, result.data, "Users fetched", 200, result.meta);
});
exports.getUser = (0, error_middleware_1.asyncHandler)(async (req, res) => {
    const data = await user_service_1.userService.getById(req.params.id, req.user);
    return (0, response_1.sendSuccess)(res, data, "User fetched");
});
exports.updateUser = (0, error_middleware_1.asyncHandler)(async (req, res) => {
    const data = await user_service_1.userService.update(req.params.id, req.body, req.user);
    return (0, response_1.sendSuccess)(res, data, "User updated");
});
exports.deleteUser = (0, error_middleware_1.asyncHandler)(async (req, res) => {
    const data = await user_service_1.userService.remove(req.params.id, req.user);
    return (0, response_1.sendSuccess)(res, data, "User deleted");
});
exports.uploadAvatar = (0, error_middleware_1.asyncHandler)(async (req, res) => {
    if (!req.file) {
        return (0, response_1.sendSuccess)(res, null, "No file uploaded", 400);
    }
    const data = await user_service_1.userService.uploadAvatar(req.user._id.toString(), req.file);
    return (0, response_1.sendSuccess)(res, data, "Avatar uploaded");
});
exports.uploadResume = (0, error_middleware_1.asyncHandler)(async (req, res) => {
    if (!req.file) {
        return (0, response_1.sendSuccess)(res, null, "No file uploaded", 400);
    }
    const data = await user_service_1.userService.uploadResume(req.user._id.toString(), req.file);
    return (0, response_1.sendSuccess)(res, data, "Resume uploaded");
});
exports.deleteResume = (0, error_middleware_1.asyncHandler)(async (req, res) => {
    const data = await user_service_1.userService.deleteResume(req.user._id.toString());
    return (0, response_1.sendSuccess)(res, data, "Resume deleted");
});
exports.clearSearchHistory = (0, error_middleware_1.asyncHandler)(async (req, res) => {
    const data = await user_service_1.userService.clearSearchHistory(req.user._id.toString());
    return (0, response_1.sendSuccess)(res, data, "Search history cleared");
});
exports.clearRecentlyViewed = (0, error_middleware_1.asyncHandler)(async (req, res) => {
    const data = await user_service_1.userService.clearRecentlyViewed(req.user._id.toString());
    return (0, response_1.sendSuccess)(res, data, "Recently viewed cleared");
});
exports.setMyRole = (0, error_middleware_1.asyncHandler)(async (req, res) => {
    const data = await user_service_1.userService.setMyRole(req.user, req.body.role);
    return (0, response_1.sendSuccess)(res, data, "Role updated");
});
//# sourceMappingURL=user.controller.js.map