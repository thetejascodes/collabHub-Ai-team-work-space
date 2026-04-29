import { Types, type SortOrder } from "mongoose";
import { Project } from "../models/project.model.js";
import type { IWorkspaceDocument } from "../models/workspace.model.js";
import { logActivity, ActivityActionTypes, EntityTypes } from "./activity.services.js";
import ApiError from "../utils/apiError.utils.js";

interface CreateProjectServiceInput {
  name: string;
  description?: string | undefined;
  workspace: IWorkspaceDocument;
  userId: string;
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
}

interface UpdateProjectServiceInput {
  projectId: string;
  name?: string;
  description?: string;
  leadId?: string;
  userId: string;
  workspaceId: string;
}

interface DeleteProjectServiceInput {
  projectId: string;
  userId: string;
  workspaceId: string;
}
export const createProjectService = async (data: CreateProjectServiceInput) => {
  const { name, description, workspace, userId } = data;

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

  // Log activity
  await logActivity({
    workspaceId: workspace._id.toString(),
    userId: userId,
    actionType: ActivityActionTypes.PROJECT_CREATED,
    entityType: EntityTypes.PROJECT,
    entityId: project._id,
    message: `Project "${project.name}" created`,
    details: {
      name: project.name,
      description: project.description,
    },
  });

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
  const { projectId } = data;
    if (!Types.ObjectId.isValid(projectId)) {
      throw ApiError.badRequest("Invalid project ID");
    }

    const project = await Project.findById(projectId)
      .populate("workspaceId", "name")
      .populate("leadId", "name email")
      .lean();

    if (!project) {
      throw ApiError.notFound("Project not found");
    }

    return project;
};

export const updateProjectService = async(data:UpdateProjectServiceInput) => {
  const {projectId, name, description, leadId, userId, workspaceId} =  data;
  if(!Types.ObjectId.isValid(projectId)){
    throw ApiError.badRequest('Invalid project id')
  }
    if (leadId && !Types.ObjectId.isValid(leadId)) {
    throw ApiError.badRequest("Invalid lead id");
  }
  const updateData : Record<string,any> = {};
  const changedFields: string[] = [];

  if(name !== undefined) {
    updateData.name = name;
    changedFields.push('name');
  }
  if(description !== undefined) {
    updateData.description = description;
    changedFields.push('description');
  }
  if(leadId !== undefined) {
    updateData.leadId = leadId;
    changedFields.push('leadId');
  }

  const project = await Project.findByIdAndUpdate(projectId, updateData, { new: true, runValidators: true })

  if (!project) {
    throw ApiError.notFound("Project not found or access denied");
  }

  // Log activity
  await logActivity({
    workspaceId: workspaceId,
    userId: userId,
    actionType: ActivityActionTypes.PROJECT_UPDATED,
    entityType: EntityTypes.PROJECT,
    entityId: projectId,
    message: `Project "${project.name}" updated`,
    details: {
      changedFields,
      name: project.name,
      description: project.description,
      leadId: project.leadId,
    },
  });

  return project;
}

export const deleteProjectService = async(data:DeleteProjectServiceInput)=>{
  const { projectId, userId, workspaceId } = data;
  if (!Types.ObjectId.isValid(projectId)) {
    throw ApiError.badRequest("Invalid project ID");
  }
  
  const project = await Project.findByIdAndDelete(projectId);

  if (!project) {
    throw ApiError.notFound("Project not found");
  }

  // Log activity
  await logActivity({
    workspaceId: workspaceId,
    userId: userId,
    actionType: ActivityActionTypes.PROJECT_DELETED,
    entityType: EntityTypes.PROJECT,
    entityId: projectId,
    message: `Project "${project.name}" deleted`,
    details: {
      name: project.name,
      description: project.description,
    },
  });

  return;
};
