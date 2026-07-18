import { ObjectId } from "mongodb";
import { notificationRepository } from "../repositories";
import type { NotificationType } from "../types";
import { ForbiddenError } from "../utils/errors";

export async function createNotification(input: {
  receiverId: ObjectId | string;
  title: string;
  message: string;
  type?: NotificationType;
  link?: string;
}) {
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

export async function getUserNotifications(userId: ObjectId, page: number, limit: number) {
  const { data, total } = await notificationRepository.listByUser(userId, page, limit);
  const unreadCount = await notificationRepository.unreadCount(userId);
  return { data, total, unreadCount };
}

export async function markNotificationRead(id: string, userId: ObjectId) {
  const notification = await notificationRepository.findByIdOrThrow(id, "Notification not found");
  if (notification.receiverId.toString() !== userId.toString()) {
    throw new ForbiddenError("Forbidden");
  }
  return notificationRepository.updateById(id, {
    $set: { isRead: true, updatedAt: new Date() },
  });
}

export async function markAllNotificationsRead(userId: ObjectId) {
  return notificationRepository.markAllRead(userId);
}

export async function deleteNotification(id: string, userId: ObjectId) {
  const notification = await notificationRepository.findByIdOrThrow(id, "Notification not found");
  if (notification.receiverId.toString() !== userId.toString()) {
    throw new ForbiddenError("Forbidden");
  }
  return notificationRepository.deleteById(id);
}
