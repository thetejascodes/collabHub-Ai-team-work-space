import { error } from "node:console";
import { Workspace } from "../models/workspace.model.js";
import mongoose from "mongoose";
export const createWorkspaceService = async (data: any) => {
  const workspace = await Workspace.create({
    name: data.name,
    description: data.description,
    owner: data.owner,
    members: [
      {
        user: data.owner,
        role: "owner",
      },
    ],
  });
  return workspace;
};

export const getMyWorkspaceService = async (userId: string) => {
  const myWorkspaces = await Workspace.find({
    $or: [{ owner: userId }, { "members.user": userId }],
  })
    .populate("owner", "name email")
    .populate("members.user", "name email")
    .lean();

  return myWorkspaces;
};

export const getWorkspaceByIdService = async (workspaceId: string) => {
  const workspaceById = await Workspace.findById(workspaceId)
    .populate("owner", "name email")
    .populate("members.user", "name email")
    .lean();
  return workspaceById;
};

export const inviteWorkspaceMemberService = async (data: any) => {
  const { user, workspaceIdParams, userFromBody } = data;

  if (user.role !== "owner" && user.role !== "admin") {
    throw new Error("Only admin or owner can invite members");
  }

  if (!mongoose.Types.ObjectId.isValid(workspaceIdParams)) {
    throw new Error("Invalid workspace ID");
  }

  if (!userFromBody?.userId) {
    throw new Error("userId is required");
  }

  const workspaceById = await Workspace.findById(workspaceIdParams);

  if (!workspaceById) {
    throw new Error("Workspace not found");
  }

  const userIdFromBody = userFromBody.userId;

  const alreadyMember = workspaceById.members.some(
    (member) => member.user.toString() === userIdFromBody,
  );

  if (alreadyMember) {
    throw new Error("User is already member of workspace");
  }

  workspaceById.members.push({
    user: userIdFromBody,
    role: "member",
    joinedAt: new Date(),
  });

  await workspaceById.save();

  return workspaceById;
};

export const removeMemberFromWorkspaceServices = async (data: any) => {
  const { memberId, workspaceId, userRole } = data;

  if (userRole === "admin") {
    const workspace = await Workspace.findById(workspaceId);

    if (!workspace) {
      throw new Error("Workspace not found");
    }
    const memberExists = workspace.members.some(
      (m) => m.user.toString() === memberId,
    );

    if (!memberExists) {
      throw new Error("Member not found in workspace");
    }

    workspace.members = workspace.members.filter(
      (m) => m.user.toString() !== memberId,
    );
    await workspace.save();
    return workspace;
  }
};

export const changeMemberRoleServices = async (data: any) => {
  try {
    const { userRole, workspaceId, userIdFromBody, roleFromBody } = data;

    if (userRole !== "admin") {
      throw new Error("You are not allowed to change roles");
    }

    const workspace = await Workspace.findById(workspaceId);

    if (!workspace) {
      throw new Error("Workspace not found");
    }

    const member = workspace.members.find(
      (m: any) => m.user.toString() === userIdFromBody,
    );

    if (!member) {
      throw new Error("Member not found in workspace");
    }

    member.role = roleFromBody;

    await workspace.save();

    return member;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
