import { ObjectId } from "mongodb";
import { notificationRepository } from "../repositories/index.js";
import { ForbiddenError } from "../utils/errors.js";
export async function createNotification(input) {
    const now = new Date();
    return notificationRepository.insertOne({
        receiverId: new ObjectId(input.receiverId),
        title: input.title,
        message: input.message,
        type: input.type || "info",
        isRead: false,
        link: input.link,
        createdAt: now,
        updatedAt: now,
    });
}
export async function getUserNotifications(userId, page, limit) {
    const { data, total } = await notificationRepository.listByUser(userId, page, limit);
    const unreadCount = await notificationRepository.unreadCount(userId);
    return { data, total, unreadCount };
}
export async function markNotificationRead(id, userId) {
    const notification = await notificationRepository.findByIdOrThrow(id, "Notification not found");
    if (notification.receiverId.toString() !== userId.toString()) {
        throw new ForbiddenError("Forbidden");
    }
    return notificationRepository.updateById(id, {
        $set: { isRead: true, updatedAt: new Date() },
    });
}
export async function markAllNotificationsRead(userId) {
    return notificationRepository.markAllRead(userId);
}
export async function deleteNotification(id, userId) {
    const notification = await notificationRepository.findByIdOrThrow(id, "Notification not found");
    if (notification.receiverId.toString() !== userId.toString()) {
        throw new ForbiddenError("Forbidden");
    }
    return notificationRepository.deleteById(id);
}
//# sourceMappingURL=notification.service.js.map