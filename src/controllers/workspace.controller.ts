import {
   createWorkspaceService, getMyWorkspaceService} from "../services/workspace.services.js";
import type { Request, Response } from "express";
import { createWorkspaceValidator } from "../validators//workspace.validator.js";

export const createWorkspace = async (req: Request, res: Response) => {
  const parsed = createWorkspaceValidator.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json(parsed.error);
  }

  const userId = (req as any).user.userId;

  const workspace = await createWorkspaceService({
    ...parsed.data,
    owner: userId,
  });

  res.status(201).json(workspace);
};

export const getMyWorkspace = async (req: Request, res: Response) => {
  const userId = (req as any).user.userId;
  const workspace = await getMyWorkspaceService(userId);
  res.status(200).json(workspace);
};
