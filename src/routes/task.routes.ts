import { Router } from "express";
import { createTask, getTasks } from "../controllers/task.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { checkWorkspaceAccess } from "../middleware/checkWorkspaceAccess.middleware.js";

const router = Router();

router.get(
  "/workspace/:workspaceId/tasks",
  authMiddleware,
  checkWorkspaceAccess(),
  getTasks
);

router.post(
  "/workspace/:workspaceId/project/:projectId/tasks",
  authMiddleware,
  checkWorkspaceAccess(),
  createTask
);

export default router;
