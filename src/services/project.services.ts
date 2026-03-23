import { Types, type SortOrder } from "mongoose";
import { Project } from "../models/project.model.js";
import { Workspace } from "../models/workspace.model.js";
import type { IWorkspaceDocument, IWorkspaceMember } from "../models/workspace.model.js";
import ApiError from "../utils/apiError.utils.js";

interface CreateProjectServiceInput {
  name: string;
  description?: string | undefined;
  workspace: IWorkspaceDocument;
}

interface GetProjectsServiceInput {
  workspaceId: string;
  limit?: number;
  cursorCreatedAt?: string | undefined;
  cursorId?: string | undefined;
  sortBy?: string | undefined;
  order?: string | undefined;
}

interface GetProjectServiceInput {
  projectId: string;
  user: Express.AuthUser;
}

export const createProjectService = async (data: CreateProjectServiceInput) => {
  const { name, description, workspace } = data;

  const projectPayload: {
    name: string;
    description?: string;
    workspaceId: Types.ObjectId;
  } = {
    name,
    workspaceId: workspace._id,
  };

  if (description !== undefined) {
    projectPayload.description = description;
  }

  const project = await Project.create(projectPayload);

  return project;
};
export const getProjectsServices = async (data: GetProjectsServiceInput) => {
  const {
      workspaceId,
      limit = 10,
      cursorCreatedAt,
      cursorId,
      sortBy = "createdAt",
      order = "desc",
    } = data;
    if (!Types.ObjectId.isValid(workspaceId)) {
      throw ApiError.badRequest("Invalid workspace ID");
    }

    const safeLimit = Math.min(Number(limit), 50);

    const query: Record<string, unknown> = {
      workspaceId,
    };

    if (cursorCreatedAt && cursorId) {
      query.$or = [
        { createdAt: { $lt: new Date(cursorCreatedAt) } },
        {
          createdAt: new Date(cursorCreatedAt),
          _id: { $lt: cursorId },
        },
      ];
    }

    const sortOrder = order === "asc" ? 1 : -1;

    const sort: Record<string, SortOrder> = {
      [sortBy]: sortOrder as SortOrder,
      _id: sortOrder,
    };

    const projects = await Project.find(query)
      .sort(sort)
      .limit(safeLimit + 1);

    let hasNextPage = false;

    if (projects.length > safeLimit) {
      hasNextPage = true;
      projects.pop();
    }

    const lastProject = projects[projects.length - 1];
    const nextCursor =
      hasNextPage && lastProject
        ? {
            createdAt: lastProject.createdAt,
            _id: lastProject._id,
          }
        : null;

    return {
      data: projects,
      nextCursor,
      hasNextPage,
      limit: safeLimit,
    };
};

export const getProjectService = async (data: GetProjectServiceInput) => {
  const { projectId, user } = data;
    if (!Types.ObjectId.isValid(projectId)) {
      throw ApiError.badRequest("Invalid project ID");
    }

    const project = await Project.findById(projectId)
      .populate("workspaceId", "name")
      .populate("leadId", "name email")
      .lean();
    const workspace = await Workspace.findById(project?.workspaceId);

    const isMember = workspace?.members.some((member: IWorkspaceMember) =>
      member.user.equals(user.userId),
    );

    if (!isMember) {
      throw ApiError.forbidden("Access denied");
    }
    if (!project) {
      throw ApiError.notFound("Project not found");
    }

    return project;
};
