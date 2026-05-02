import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { checkWorkspaceAccess } from "../middleware/checkWorkspaceAccess.middleware.js";
import {
  getWorkspaceActivity,
  getUnreadActivity,
  markAsRead,
} from "../controllers/activity.controller.js";

const router = Router();

router.get(
  "/:workspaceId/activities",
  authMiddleware,
  checkWorkspaceAccess(),
  getWorkspaceActivity
);

router.get(
  "/:workspaceId/activities/unread",
  authMiddleware,
  checkWorkspaceAccess(),
  getUnreadActivity
);

router.patch(
  "/activities/:activityId/read",
  authMiddleware,
  markAsRead
);

export default router;