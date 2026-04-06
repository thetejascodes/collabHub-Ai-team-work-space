import { Router } from "express";
import { createTask, deleteTask, getTask, getTasks, updateTask } from "../controllers/task.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { checkWorkspaceAccess } from "../middleware/checkWorkspaceAccess.middleware.js";

const router = Router();

router.get(
  "/workspace/:workspaceId/tasks",
  authMiddleware,
  checkWorkspaceAccess(),
  getTasks
);
router.get(
  "/workspace/:workspaceId/project/:projectId/task/:taskId",
  authMiddleware,
  checkWorkspaceAccess(),
  getTask
);
router.get(
  "/workspace/:workspaceId/project/:projectId/tasks/:taskId",
  authMiddleware,
  checkWorkspaceAccess(),
  getTask
);
router.post(
  "/workspace/:workspaceId/project/:projectId/tasks",
  authMiddleware,
  checkWorkspaceAccess(),
  createTask
);
router.patch(
  "/workspace/:workspaceId/project/:projectId/tasks/:taskId",
  authMiddleware,
  checkWorkspaceAccess(),
  updateTask
);
router.delete("/workspace/:workspaceId/project/:projectId/tasks/:taskId",authMiddleware,checkWorkspaceAccess(),deleteTask)

export default router;
