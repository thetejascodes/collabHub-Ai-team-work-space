import {
  createWorkspaceService,
  getMyWorkspaceService,
  getWorkspaceByIdService,
  inviteWorkspaceMemberService,
  removeMemberFromWorkspaceServices,
} from "../services/workspace.services.js";

import type { Request, Response } from "express";
import { createWorkspaceValidator } from "../validators/workspace.validator.js";

export const createWorkspace = async (req: Request, res: Response) => {
  const parsed = createWorkspaceValidator.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json(parsed.error);
  }

  const userId = (req as any).user.userId;

  const workspace = await createWorkspaceService({
    ...parsed.data,
    owner: userId,
  });

  return res.status(201).json(workspace);
};

export const getMyWorkspace = async (req: Request, res: Response) => {
  const userId = (req as any).user.userId;

  const workspace = await getMyWorkspaceService(userId);

  if (!workspace) {
    return res.status(404).json({
      message: "workspace not found",
    });
  }

  return res.status(200).json(workspace);
};

export const getWorkspaceById = async (req: Request, res: Response) => {
  const workspaceIdParams = req.params.workspaceId as string;

  if (!workspaceIdParams) {
    return res.status(400).json({
      message: "invalid workspace id",
    });
  }

  const workspace = await getWorkspaceByIdService(workspaceIdParams);

  return res.status(200).json(workspace);
};

export const inviteWorkspaceMember = async (req: Request, res: Response) => {
  try {
    const workspaceIdParams = req.params.workspaceId;
    const user = (req as any).user;
    const userFromBody = req.body;

    const result = await inviteWorkspaceMemberService({
      workspaceIdParams,
      user,
      userFromBody,
    });

    if (typeof result === "string") {
      return res.status(400).json({ message: result });
    }

    return res.status(200).json({
      message: "Member invited successfully",
      workspace: result,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

export const removeMemberFromWorkspace = async (
  req: Request,
  res: Response,
) => {
  try {
    const workspaceId = req.params.workspaceId;
    const memberId = req.params.memberId;
    const userRole = (req as any).user.role;

    await removeMemberFromWorkspaceServices({
      workspaceId,
      memberId,
      userRole,
    });
    res.sendStatus(204);
  } catch (error) {
    console.error(error)
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};
