import { Types } from "mongoose";
import { Workspace } from "../models/workspace.model.js";
import type { IWorkspaceDocument, IWorkspaceMember } from "../models/workspace.model.js";
import ApiError from "../utils/apiError.utils.js";

interface CreateWorkspaceServiceInput {
  name: string;
  description?: string | undefined;
  owner: string;
}

interface InviteWorkspaceMemberServiceInput {
  workspace: IWorkspaceDocument;
  userFromBody: {
    userId?: string;
  };
}

interface RemoveMemberFromWorkspaceServiceInput {
  memberId: string;
  workspace: IWorkspaceDocument;
}

interface ChangeMemberRoleServiceInput {
  workspace: IWorkspaceDocument;
  userIdFromBody: string;
  roleFromBody: "owner" | "admin" | "member";
}

interface LeaveWorkspaceServiceInput {
  workspace: IWorkspaceDocument;
  user: string;
}

interface DeleteWorkspaceServiceInput {
  workspace: IWorkspaceDocument;
}

export const createWorkspaceService = async (data: CreateWorkspaceServiceInput) => {
  const workspacePayload: {
    name: string;
    description?: string;
    owner: string;
    members: Array<{ user: string; role: "owner" }>;
  } = {
    name: data.name,
    owner: data.owner,
    members: [
      {
        user: data.owner,
        role: "owner",
      },
    ],
  };

  if (data.description !== undefined) {
    workspacePayload.description = data.description;
  }

  const workspace = await Workspace.create(workspacePayload);
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

export const inviteWorkspaceMemberService = async (data: InviteWorkspaceMemberServiceInput) => {
  const { workspace, userFromBody } = data;

  if (!userFromBody?.userId) {
    throw ApiError.badRequest("userId is required")
  }

  const userIdFromBody = userFromBody.userId;

  const alreadyMember = workspace.members.some(
    (member: IWorkspaceMember) => member.user.toString() === userIdFromBody,
  );

  if (alreadyMember) {
    throw ApiError.conflict("User is already member of workspace")
  }

  workspace.members.push({
    user: new Types.ObjectId(userIdFromBody),
    role: "member",
    joinedAt: new Date(),
  });

  await workspace.save();

  return workspace;
};

export const removeMemberFromWorkspaceServices = async (data: RemoveMemberFromWorkspaceServiceInput) => {
  const { memberId, workspace } = data;

  const memberExists = workspace.members.some(
    (member: IWorkspaceMember) => member.user.toString() === memberId,
  );

  if (!memberExists) {
    throw ApiError.notFound("Member not found in workspace")
  }

  workspace.members = workspace.members.filter(
    (member: IWorkspaceMember) => member.user.toString() !== memberId,
  );
  await workspace.save();
  return workspace;
};

export const changeMemberRoleServices = async (data: ChangeMemberRoleServiceInput) => {
  const { workspace, userIdFromBody, roleFromBody } = data;

    const member = workspace.members.find(
      (currentMember: IWorkspaceMember) => currentMember.user.toString() === userIdFromBody,
    );

    if (!member) {
      throw ApiError.notFound("Member not found in workspace")
    }

    member.role = roleFromBody;

    await workspace.save();

    return member;
};

export const leaveWorkspaceService = async (data: LeaveWorkspaceServiceInput) => {
  const { workspace, user } = data;

    const isMember = workspace.members.some((member: IWorkspaceMember) => member.user.toString() === user);
    if(!isMember){
      throw ApiError.notFound("Member not found")
    }
    workspace.members = workspace.members.filter(
      (member: IWorkspaceMember) => member.user.toString() !== user,
    );
    await workspace.save();
    return workspace;
};

export const deleteWorkspaceServices = async(data: DeleteWorkspaceServiceInput)=>{
   const {workspace} = data;
    await Workspace.findByIdAndDelete(workspace._id)
    return;
}
