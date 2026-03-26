import { Types } from "mongoose";
import { Project } from "../models/project.model.js";
import { Task } from "../models/task.model.js";
import ApiError from "../utils/apiError.utils.js";

interface TaskCreateServiceInput {
  title: string;
  description?: string | undefined;
  status?: string | undefined;
  priority?: string | undefined;
  dueDate?: Date | string | undefined;
  assignedTo?: string | undefined;
  workspaceId: string;
  projectId: string;
  createdBy: string;
}

export const createTaskService = async (data: TaskCreateServiceInput) => {
  const {
    title,
    description,
    status,
    priority,
    dueDate,
    assignedTo,
    workspaceId,
    projectId,
    createdBy,
  } = data;

  if (!Types.ObjectId.isValid(workspaceId)) {
    throw ApiError.badRequest("Invalid workspace ID");
  }

  if (!Types.ObjectId.isValid(projectId)) {
    throw ApiError.badRequest("Invalid project ID");
  }

  if (!Types.ObjectId.isValid(createdBy)) {
    throw ApiError.badRequest("Invalid user ID");
  }

  if (assignedTo && !Types.ObjectId.isValid(assignedTo)) {
    throw ApiError.badRequest("Invalid assignedTo ID");
  }

  const project = await Project.findOne({
    _id: projectId,
    workspaceId,
  }).select("_id workspaceId");

  if (!project) {
    throw ApiError.notFound("Project not found in this workspace");
  }

  const taskPayload: {
    title: string;
    description?: string;
    status?: string;
    priority?: string;
    dueDate?: Date;
    assignedTo?: string;
    workspaceId: string;
    projectId: string;
    createdBy: string;
  } = {
    title,
    workspaceId,
    projectId,
    createdBy,
  };

  if (description !== undefined) {
    taskPayload.description = description;
  }

  if (status !== undefined) {
    taskPayload.status = status;
  }

  if (priority !== undefined) {
    taskPayload.priority = priority;
  }

  if (dueDate !== undefined) {
    taskPayload.dueDate = new Date(dueDate);
  }

  if (assignedTo !== undefined) {
    taskPayload.assignedTo = assignedTo;
  }

  const task = await Task.create(taskPayload);

  return task;
};
