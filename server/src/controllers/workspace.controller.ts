import {
  createWorkspaceService,
  getMyWorkspaceService,
  getWorkspaceByIdService,
  inviteWorkspaceMemberService,
  removeMemberFromWorkspaceServices,
  changeMemberRoleServices,
  leaveWorkspaceService,
  deleteWorkspaceServices,
  updateWorkspaceService,
} from "../services/workspace.services.js";

import type { Request, Response, NextFunction } from "express";
import {
  createWorkspaceValidator,
  updateWorkspaceValidator,
} from "../validators/workspace.validator.js";
import ApiError from "../utils/apiError.utils.js";

export const createWorkspace = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const parsed = createWorkspaceValidator.safeParse(req.body);

    if (!parsed.success) {
      return next(ApiError.badRequest(parsed.error.message));
    }

    const userId = req.user?.userId;

    if (!userId) {
      throw ApiError.unauthorized("Unauthorized");
    }

    const workspace = await createWorkspaceService({
      ...parsed.data,
      owner: userId,
    });

    return res.status(201).json(workspace);
  } catch (error) {
    next(error);
  }
};

export const getMyWorkspace = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      throw ApiError.unauthorized("Unauthorized");
    }

    const workspace = await getMyWorkspaceService(userId);

    if (!workspace) {
      return ApiError.notFound();
    }

    return res.status(200).json(workspace);
  } catch (error) {
    next(error);
  }
};

export const getWorkspaceById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.workspace) {
      throw ApiError.badRequest("Workspace is required");
    }

    return res.status(200).json(req.workspace);
  } catch (error) {
    next(error);
  }
};

export const inviteWorkspaceMember = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const workspace = req.workspace;
    const userFromBody = req.body;
    const userId = req.user?.userId;

    if (!workspace) {
      throw ApiError.badRequest("Workspace is required");
    }

    if (!userId) {
      throw ApiError.unauthorized("Unauthorized");
    }

    const result = await inviteWorkspaceMemberService({
      workspace,
      userFromBody,
      userId,
      workspaceId: workspace._id.toString(),
    });

    if (typeof result === "string") {
      return res.status(400).json({ message: result });
    }

    return res.status(200).json({
      message: "Member invited successfully",
      workspace: result,
    });
  } catch (error) {
    next(error);
  }
};

export const removeMemberFromWorkspace = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const workspace = req.workspace;
    const memberId = typeof req.params.memberId === "string" ? req.params.memberId : undefined;
    const userId = req.user?.userId;

    if (!workspace) {
      throw ApiError.badRequest("Workspace is required");
    }

    if (!memberId) {
      throw ApiError.badRequest("Member id is required");
    }

    if (!userId) {
      throw ApiError.unauthorized("Unauthorized");
    }

    await removeMemberFromWorkspaceServices({
      workspace,
      memberId,
      userId,
      workspaceId: workspace._id.toString(),
    });
    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
};

export const changeMemberRole = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const workspace = req.workspace;
    const userIdFromBody = req.body.userId as string;
    const roleFromBody = req.body.role as "owner" | "admin" | "member";
    const userId = req.user?.userId;

    if (!workspace) {
      throw ApiError.badRequest("Workspace is required");
    }

    if (!userId) {
      throw ApiError.unauthorized("Unauthorized");
    }

    const result = await changeMemberRoleServices({
      workspace,
      userIdFromBody,
      roleFromBody,
      userId,
      workspaceId: workspace._id.toString(),
    });

    return res.status(200).json({
      message: "Member role updated successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const leaveWorkspace = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const currentWorkspace = req.workspace;
    const user = req.user?.userId as string;

    if (!currentWorkspace) {
      throw ApiError.badRequest("Workspace is required");
    }

    const workspace = await leaveWorkspaceService({
      workspace: currentWorkspace,
      user,
      workspaceId: currentWorkspace._id.toString(),
    });
    res.status(200).json(workspace);
  } catch (error) {
    next(error);
  }
};

export const updateWorkspace = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const workspace = req.workspace;
    const userId = req.user?.userId;

    if (!workspace) {
      throw ApiError.badRequest("Workspace is required");
    }

    if (!userId) {
      throw ApiError.unauthorized("Unauthorized");
    }

    const parsed = updateWorkspaceValidator.safeParse(req.body);

    if (!parsed.success) {
      throw ApiError.badRequest(parsed.error.message);
    }

    const updatedWorkspace = await updateWorkspaceService({
      workspace,
      ...parsed.data,
      userId,
      workspaceId: workspace._id.toString(),
    });

    return res.status(200).json(updatedWorkspace);
  } catch (error) {
    next(error);
  }
};

export const deleteWorkspace = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const workspace = req.workspace;
    const userId = req.user?.userId;

    if (!workspace) {
      throw ApiError.badRequest("Workspace is required");
    }

    if (!userId) {
      throw ApiError.unauthorized("Unauthorized");
    }

    await deleteWorkspaceServices({
      workspace,
      userId,
      workspaceId: workspace._id.toString(),
    });
    res.status(204).json();
  } catch (error) {
    next(error);
  }
};
