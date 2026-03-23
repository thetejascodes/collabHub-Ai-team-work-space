import type { Request, Response, NextFunction } from "express";
import { Types } from "mongoose";
import ApiError from "../utils/apiError.utils.js";
import { Workspace } from "../models/workspace.model.js";

export const checkWorkspaceAccess = (requiredRoles: string[] = []) => {
  return async (req: Request, _res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.userId;
      const workspaceId =
        req.params.workspaceId ??
        (typeof req.body?.workspaceId === "string" ? req.body.workspaceId : undefined);

      if (!userId) {
        throw ApiError.unauthorized("Unauthorized");
      }

      if (!workspaceId) {
        throw ApiError.badRequest("Workspace is required");
      }

      if (!Types.ObjectId.isValid(workspaceId)) {
        throw ApiError.badRequest("Invalid workspace ID");
      }

      const workspace = await Workspace.findById(workspaceId);

      if (!workspace) {
        throw ApiError.notFound("Workspace not found");
      }

      const member = workspace.members.find(
        (currentMember) => currentMember.user.toString() === userId,
      );

      if (!member) {
        throw ApiError.forbidden("Access denied: Not a workspace member");
      }

      if (requiredRoles.length > 0 && !requiredRoles.includes(member.role)) {
        throw ApiError.forbidden("Insufficient permissions");
      }

      req.workspace = workspace;
      req.workspaceMember = member;
      next();
    } catch (error) {
      next(error);
    }
  };
};
