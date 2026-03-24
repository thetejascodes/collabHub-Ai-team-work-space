import type { Request, Response, NextFunction } from "express";
import { Types } from "mongoose";
import ApiError from "../utils/apiError.utils.js";
import { Project } from "../models/project.model.js";
import { Workspace } from "../models/workspace.model.js";

export const checkWorkspaceAccess = (requiredRoles: string[] = []) => {
  return async (req: Request, _res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.userId;
      let workspaceId =
        req.params.workspaceId ??
        (typeof req.body?.workspaceId === "string" ? req.body.workspaceId : undefined);
      const projectId =
        typeof req.params.projectId === "string" ? req.params.projectId : undefined;

      if (!userId) {
        throw ApiError.unauthorized("Unauthorized");
      }

      if (!workspaceId && projectId) {
        if (!Types.ObjectId.isValid(projectId)) {
          throw ApiError.badRequest("Invalid project ID");
        }

        const project = await Project.findById(projectId).select("workspaceId").lean();

        if (!project) {
          throw ApiError.notFound("Project not found");
        }

        workspaceId = project.workspaceId.toString();
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
