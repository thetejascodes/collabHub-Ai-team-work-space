import { Types } from "mongoose";
import { Project } from "../models/project.model.js";
import { Workspace } from "../models/workspace.model.js";
import ApiError from "../utils/apiError.utils.js";
export const createProjectService = async (data: any) => {
  const { user, name, description, workspaceId } = data;

  if (!Types.ObjectId.isValid(workspaceId)) {
    throw ApiError.badRequest("Invalid workspace ID");
  }

  const workspace = await Workspace.findById(workspaceId);

  if (!workspace) {
    throw ApiError.notFound("Workspace not found");
  }

  const userIsMemberOfWorkspace = workspace.members.some(
    (member) => member.user.toString() === user.userId
  );

  if (!userIsMemberOfWorkspace) {
    throw ApiError.forbidden("User is not member of workspace");
  }

  const project = await Project.create({
    name,
    description,
    workspaceId,
  });

  return project;
};
export const getProjectsServices = async (data: any) => {
  const {
      user,
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
    const workspace = await Workspace.findById(workspaceId);
    if (!workspace) {
      throw ApiError.notFound("Workspace not found");
    }

    const isMember = workspace.members.some((member: any) =>
      member.user.equals(user.userId),
    );

    if (!isMember) {
      throw ApiError.forbidden("Access denied");
    }

    const safeLimit = Math.min(Number(limit), 50);

    const query: any = {
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

    const sort: any = {
      [sortBy]: sortOrder,
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

export const getProjectService = async (data: any) => {
  const { projectId, user } = data;
    if (!Types.ObjectId.isValid(projectId)) {
      throw ApiError.badRequest("Invalid project ID");
    }

    const project = await Project.findById(projectId)
      .populate("workspaceId", "name")
      .populate("leadId", "name email")
      .lean();
    const workspace = await Workspace.findById(project?.workspaceId);

    const isMember = workspace?.members.some((member: any) =>
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
