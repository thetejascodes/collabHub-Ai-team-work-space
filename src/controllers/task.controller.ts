import type { Request, Response, NextFunction } from "express";
import { createTaskService } from "../services/task.services.js";
import { createTaskValidator } from "../validators/task.validator.js";
import ApiError from "../utils/apiError.utils.js";

export const createTask = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const parsed = createTaskValidator.safeParse(req.body);
    const userId = req.user?.userId;
    const workspaceId = req.params.workspaceId as string;
    const projectId = req.params.projectId as string;

    if (!parsed.success) {
      throw ApiError.badRequest(parsed.error.message);
    }

    if (!userId) {
      throw ApiError.unauthorized("Unauthorized");
    }

    if (!req.workspace) {
      throw ApiError.badRequest("Workspace is required");
    }

    const result = await createTaskService({
      ...parsed.data,
      workspaceId,
      projectId,
      createdBy: userId,
    });

    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};
