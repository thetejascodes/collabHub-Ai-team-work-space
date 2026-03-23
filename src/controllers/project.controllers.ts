import type { Request, Response, NextFunction } from "express";
import {
  createProjectService,
  getProjectService,
  getProjectsServices,
} from "../services/project.services.js";
import { createProjectValidator } from "../validators/project.validator.js";
import ApiError from "../utils/apiError.utils.js";

export const createProject = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const parsed = createProjectValidator.safeParse(req.body);

    if (!parsed.success) {
      throw ApiError.badRequest(parsed.error.message);
    }

    const workspace = req.workspace;

    if (!workspace) {
      throw ApiError.badRequest("Workspace is required");
    }

    const project = await createProjectService({
      ...parsed.data,
      workspace,
    });

    res.status(201).json(project);
  } catch (error) {
    next(error);
  }
};

export const getProjectsController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { limit, cursorCreatedAt, cursorId, sortBy, order } = req.query;
    const workspace = req.workspace;

    if (!workspace) {
      throw ApiError.badRequest("Workspace is required");
    }

    const result = await getProjectsServices({
      workspaceId: workspace._id.toString(),
      limit: limit ? Number(limit) : 10,
      cursorCreatedAt: typeof cursorCreatedAt === "string" ? cursorCreatedAt : undefined,
      cursorId: typeof cursorId === "string" ? cursorId : undefined,
      sortBy: typeof sortBy === "string" ? sortBy : undefined,
      order: typeof order === "string" ? order : undefined,
    });

    res.status(200).json({
      success: true,
      message: "Projects fetched successfully",
      ...result,
    });
  } catch (error) {
    next(error);
  }
};

export const getProject = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const projectId = req.params.projectId as string;
    const user = req.user;

    if (!user) {
      throw ApiError.unauthorized("Unauthorized");
    }

    const project = await getProjectService({
      projectId,
      user,
    });

    res.status(200).json(project);
  } catch (error) {
    next(error);
  }
};
