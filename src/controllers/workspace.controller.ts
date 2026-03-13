import { createWorkspace as createWorkspaceService } from "../services/workspace.services.js";
import type { Request, Response } from "express";

export const createWorkspace = async (req: Request, res: Response) => {
  const userId = (req as any).user.userId;

  const workspace = await createWorkspaceService({
    ...req.body,
    owner: userId,
  });

  res.status(201).json(workspace);
};