import mongoose from "mongoose";
import { Project } from "../models/project.model.js";
import { Workspace } from "../models/workspace.model.js";

export const createProjectService = async (data: any) => {
  try {
    const { user, parsed } = data;
    const workspace = await Workspace.findById(parsed.data.workspaceId);
    if (!workspace) {
      throw new Error("Workspace not found");
    }
    const userIsMemberOfWorkspace = workspace.members.some(
      (member) => member.user.toString() === user.userId,
    );
    if (!userIsMemberOfWorkspace) {
      throw new Error("User is not member of workspace");
    }
    const project = await Project.create(parsed.data);
    return project;
  } catch (error) {
    console.error(error);
    throw error;
  }
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
  console.log("Incoming cursor:", cursorCreatedAt, cursorId);
  const workspace = await Workspace.findById(workspaceId);
  if (!workspace) {
    throw new Error("Workspace not found");
  }

  const isMember = workspace.members.some((member: any) =>
    member.user.equals(user.userId),
  );

  if (!isMember) {
    throw new Error("Unauthorized");
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
