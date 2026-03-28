import { Types, type SortOrder } from "mongoose";
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

interface GetTasksServiceInput {
  workspaceId: string;
  projectId?: string | undefined;
  assignedTo?: string | undefined;
  createdBy?: string | undefined;
  status?: string | undefined;
  priority?: string | undefined;
  limit?: number | undefined;
  cursorCreatedAt?: string | undefined;
  cursorId?: string | undefined;
  order?: string | undefined;
}
interface GetTaskServiceInput{
 taskId:string;
 workspaceId:string;
 projectId:string;
 userId:string;
 role:string;
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

export const getTasksService = async (data: GetTasksServiceInput) => {
  const {
    workspaceId,
    projectId,
    assignedTo,
    createdBy,
    status,
    priority,
    limit = 3,
    cursorCreatedAt,
    cursorId,
    order = "desc",
  } = data;

  if (!Types.ObjectId.isValid(workspaceId)) {
    throw ApiError.badRequest("Invalid workspace ID");
  }

  if (projectId && !Types.ObjectId.isValid(projectId)) {
    throw ApiError.badRequest("Invalid project ID");
  }

  if (assignedTo && !Types.ObjectId.isValid(assignedTo)) {
    throw ApiError.badRequest("Invalid assignedTo ID");
  }

  if (createdBy && !Types.ObjectId.isValid(createdBy)) {
    throw ApiError.badRequest("Invalid createdBy ID");
  }
  

  if (cursorId && !Types.ObjectId.isValid(cursorId)) {
    throw ApiError.badRequest("Invalid cursor ID");
  }

  const safeLimit = Math.min(Number(limit), 50);
  const query: Record<string, unknown> = { workspaceId };

  if (projectId) {
    query.projectId = projectId;
  }

  if (assignedTo) {
    query.assignedTo = assignedTo;
  }

  if (createdBy) {
    query.createdBy = createdBy;
  }

  if (status) {
    query.status = status;
  }

  if (priority) {
    query.priority = priority;
  }

  if (cursorCreatedAt && cursorId) {
    const cursorDate = new Date(cursorCreatedAt);
    const cursorComparison = order === "asc" ? "$gt" : "$lt";

    query.$or = [
      { createdAt: { [cursorComparison]: cursorDate } },
      {
        createdAt: cursorDate,
        _id: { [cursorComparison]: new Types.ObjectId(cursorId) },
      },
    ];
  }

  const sortOrder = order === "asc" ? 1 : -1;
  const sort: Record<string, SortOrder> = {
    createdAt: sortOrder as SortOrder,
    _id: sortOrder as SortOrder,
  };

  const tasks = await Task.find(query)
    .populate("assignedTo", "name email")
    .populate("createdBy", "name email")
    .populate("projectId", "name")
    .sort(sort)
    .limit(safeLimit + 1);

  let hasNextPage = false;

  if (tasks.length > safeLimit) {
    hasNextPage = true;
    tasks.pop();
  }

  const lastTask = tasks[tasks.length - 1];
  const nextCursor =
    hasNextPage && lastTask
      ? {
          createdAt: lastTask.createdAt,
          _id: lastTask._id,
        }
      : null;

  return {
    data: tasks,
    nextCursor,
    hasNextPage,
    limit: safeLimit,
  };
};

export const getTaskService = async (data: GetTaskServiceInput) => {
  const { taskId, workspaceId, projectId, userId, role } = data;

  if (!Types.ObjectId.isValid(taskId)) {
    throw ApiError.badRequest("Invalid task id");
  }
  if (!Types.ObjectId.isValid(workspaceId)) {
    throw ApiError.badRequest("Invalid workspace id");
  }
  if (!Types.ObjectId.isValid(projectId)) {
    throw ApiError.badRequest("Invalid project id");
  }
  if (!Types.ObjectId.isValid(userId)) {
    throw ApiError.badRequest("Invalid user id");
  }

  const task = await Task.findById(taskId)
    .populate("assignedTo", "name email")
    .populate("createdBy", "name email")
    .populate("projectId", "name")
    .lean();

  if (!task) {
    throw ApiError.notFound("Task not found");
  }

  if (task.workspaceId.toString() !== workspaceId) {
    throw ApiError.badRequest("Task not found in this workspace");
  }

  if (task.projectId._id.toString() !== projectId) {
    throw ApiError.badRequest("Task not found in this project");
  }

  const isCreator = task.createdBy._id.toString() === userId;
  const isAssigned = task.assignedTo?._id?.toString() === userId;
  const isAdmin = role === "admin";

  if (!isCreator && !isAssigned && !isAdmin) {
    throw ApiError.unauthorized("Unauthorized");
  }

  return task;
};