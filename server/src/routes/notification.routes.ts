import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { getNotifications, markNotificationRead } from '../controllers/notification.controllers.js';

const router = Router();

router.get('/', authMiddleware, getNotifications);
router.patch('/:notificationId/read', authMiddleware, markNotificationRead);

export default router;
