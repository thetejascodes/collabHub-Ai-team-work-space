import { Router } from "express";
import { createTask } from "../controllers/task.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { checkWorkspaceAccess } from "../middleware/checkWorkspaceAccess.middleware.js";

const router = Router();

router.post(
  "/workspace/:workspaceId/project/:projectId/tasks",
  authMiddleware,
  checkWorkspaceAccess(),
  createTask
);

export default router;
