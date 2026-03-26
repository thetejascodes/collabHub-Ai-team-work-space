import type { Request, Response, NextFunction } from "express";
import { createTaskService, getTasksService } from "../services/task.services.js";
import { createTaskValidator, getTasksQueryValidator } from "../validators/task.validator.js";
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

export const getTasks = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const workspaceId = req.params.workspaceId as string;

    if (!req.workspace) {
      throw ApiError.badRequest("Workspace is required");
    }

    const parsed = getTasksQueryValidator.safeParse(req.query);

    if (!parsed.success) {
      throw ApiError.badRequest(parsed.error.message);
    }

    const result = await getTasksService({
      workspaceId,
      ...parsed.data,
    });

    res.status(200).json({
      success: true,
      message: "Tasks fetched successfully",
      ...result,
    });
  } catch (error) {
    next(error);
  }
};
