import type { Request, Response, NextFunction } from 'express';
import { getNotificationsService, markNotificationReadService } from '../services/notification.services.js';
import ApiError from '../utils/apiError.utils.js';

export const getNotifications = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      throw ApiError.unauthorized('Unauthorized');
    }

    const page = Number(req.query.page ?? 1);
    const limit = Number(req.query.limit ?? 20);
    const isRead = req.query.isRead === 'true' ? true : req.query.isRead === 'false' ? false : undefined;

    const result = await getNotificationsService(userId, { page, limit, isRead });
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

export const markNotificationRead = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.userId;
    const notificationId = req.params.notificationId;
    if (!userId) throw new Error('Unauthorized');
    if (typeof notificationId !== 'string') {
      throw new Error('Invalid notificationId');
    }

    const notification = await markNotificationReadService(userId, notificationId);
    res.status(200).json({ success: true, data: notification });
  } catch (error) {
    next(error);
  }
};
