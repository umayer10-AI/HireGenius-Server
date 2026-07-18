"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createNotification = createNotification;
exports.getUserNotifications = getUserNotifications;
exports.markNotificationRead = markNotificationRead;
exports.markAllNotificationsRead = markAllNotificationsRead;
exports.deleteNotification = deleteNotification;
const mongodb_1 = require("mongodb");
const repositories_1 = require("../repositories");
const errors_1 = require("../utils/errors");
async function createNotification(input) {
    const now = new Date();
    return repositories_1.notificationRepository.insertOne({
        receiverId: new mongodb_1.ObjectId(input.receiverId),
        title: input.title,
        message: input.message,
        type: input.type || "info",
        isRead: false,
        link: input.link,
        createdAt: now,
        updatedAt: now,
    });
}
async function getUserNotifications(userId, page, limit) {
    const { data, total } = await repositories_1.notificationRepository.listByUser(userId, page, limit);
    const unreadCount = await repositories_1.notificationRepository.unreadCount(userId);
    return { data, total, unreadCount };
}
async function markNotificationRead(id, userId) {
    const notification = await repositories_1.notificationRepository.findByIdOrThrow(id, "Notification not found");
    if (notification.receiverId.toString() !== userId.toString()) {
        throw new errors_1.ForbiddenError("Forbidden");
    }
    return repositories_1.notificationRepository.updateById(id, {
        $set: { isRead: true, updatedAt: new Date() },
    });
}
async function markAllNotificationsRead(userId) {
    return repositories_1.notificationRepository.markAllRead(userId);
}
async function deleteNotification(id, userId) {
    const notification = await repositories_1.notificationRepository.findByIdOrThrow(id, "Notification not found");
    if (notification.receiverId.toString() !== userId.toString()) {
        throw new errors_1.ForbiddenError("Forbidden");
    }
    return repositories_1.notificationRepository.deleteById(id);
}
//# sourceMappingURL=notification.service.js.map