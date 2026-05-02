import { Notification } from '../models/notification.model.js';
import ApiError from '../utils/apiError.utils.js';
import { Types } from 'mongoose';

interface GetNotificationsQuery {
  page?: number;
  limit?: number;
  isRead?: boolean | undefined;
}

export const getNotificationsService = async (userId: string, query: GetNotificationsQuery) => {
  const page = query.page && query.page > 0 ? query.page : 1;
  const limit = query.limit && query.limit > 0 ? query.limit : 20;

  const filter: Record<string, any> = { userId };
  if (typeof query.isRead === 'boolean') {
    filter.isRead = query.isRead;
  }

  const total = await Notification.countDocuments(filter);
  const notifications = await Notification.find(filter)
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit)
    .lean();

  return {
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit) || 1,
    },
    data: notifications,
  };
};

export const markNotificationReadService = async (userId: string, notificationId: string) => {
  if (!Types.ObjectId.isValid(notificationId)) {
    throw new ApiError(400, 'Invalid notificationId');
  }

  const notification = await Notification.findOneAndUpdate(
    { _id: notificationId, userId },
    { isRead: true },
    { new: true },
  );

  if (!notification) {
    throw new ApiError(404, 'Notification not found');
  }

  return notification;
};
