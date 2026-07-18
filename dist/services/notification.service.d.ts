import { ObjectId } from "mongodb";
import type { NotificationType } from "../types";
export declare function createNotification(input: {
    receiverId: ObjectId | string;
    title: string;
    message: string;
    type?: NotificationType;
    link?: string;
}): Promise<import("../interfaces/models").NotificationDocument>;
export declare function getUserNotifications(userId: ObjectId, page: number, limit: number): Promise<{
    data: import("../interfaces/models").NotificationDocument[];
    total: number;
    unreadCount: number;
}>;
export declare function markNotificationRead(id: string, userId: ObjectId): Promise<import("../interfaces/models").NotificationDocument>;
export declare function markAllNotificationsRead(userId: ObjectId): Promise<number>;
export declare function deleteNotification(id: string, userId: ObjectId): Promise<boolean>;
//# sourceMappingURL=notification.service.d.ts.map