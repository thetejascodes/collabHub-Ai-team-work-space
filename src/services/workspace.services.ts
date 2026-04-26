import { Types } from "mongoose";
import { Workspace } from "../models/workspace.model.js";
import type { IWorkspaceDocument, IWorkspaceMember } from "../models/workspace.model.js";
import { logActivity, ActivityActionTypes, EntityTypes } from "./activity.services.js";
import ApiError from "../utils/apiError.utils.js";

interface CreateWorkspaceServiceInput {
  name: string;
  description?: string | undefined;
  owner: string;
}

interface WorkspaceServiceBase {
  workspaceId: string;
  userId: string;
}

interface InviteWorkspaceMemberServiceInput extends WorkspaceServiceBase {
  workspace: IWorkspaceDocument;
  userFromBody: {
    userId?: string;
  };
}

interface RemoveMemberFromWorkspaceServiceInput extends WorkspaceServiceBase {
  memberId: string;
  workspace: IWorkspaceDocument;
}

interface ChangeMemberRoleServiceInput extends WorkspaceServiceBase {
  workspace: IWorkspaceDocument;
  userIdFromBody: string;
  roleFromBody: "owner" | "admin" | "member";
}

interface LeaveWorkspaceServiceInput {
  workspace: IWorkspaceDocument;
  user: string;
  workspaceId: string;
}

interface DeleteWorkspaceServiceInput extends WorkspaceServiceBase {
  workspace: IWorkspaceDocument;
}

interface UpdateWorkspaceServiceInput extends WorkspaceServiceBase {
  workspace: IWorkspaceDocument;
  name?: string | undefined;
  description?: string | undefined;
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

  // Log activity
  await logActivity({
    workspaceId: workspace._id.toString(),
    userId: data.owner,
    actionType: ActivityActionTypes.USER_JOINED,
    entityType: EntityTypes.WORKSPACE,
    entityId: workspace._id,
    message: `Workspace "${workspace.name}" created`,
    details: {
      name: workspace.name,
      description: workspace.description,
    },
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

export const inviteWorkspaceMemberService = async (data: InviteWorkspaceMemberServiceInput) => {
  const { workspace, userFromBody, userId, workspaceId } = data;

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

  // Log activity
  await logActivity({
    workspaceId: workspaceId,
    userId: userId,
    actionType: ActivityActionTypes.USER_JOINED,
    entityType: EntityTypes.USER,
    entityId: userIdFromBody,
    message: `User joined workspace`,
    details: {
      invitedUserId: userIdFromBody,
      workspaceName: workspace.name,
    },
  });

  return workspace;
};

export const removeMemberFromWorkspaceServices = async (data: RemoveMemberFromWorkspaceServiceInput) => {
  const { memberId, workspace, userId, workspaceId } = data;

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

  // Log activity
  await logActivity({
    workspaceId: workspaceId,
    userId: userId,
    actionType: ActivityActionTypes.USER_LEFT,
    entityType: EntityTypes.USER,
    entityId: memberId,
    message: `User removed from workspace`,
    details: {
      removedUserId: memberId,
      workspaceName: workspace.name,
    },
  });

  return workspace;
};

export const changeMemberRoleServices = async (data: ChangeMemberRoleServiceInput) => {
  const { workspace, userIdFromBody, roleFromBody, userId, workspaceId } = data;

    const member = workspace.members.find(
      (currentMember: IWorkspaceMember) => currentMember.user.toString() === userIdFromBody,
    );

    if (!member) {
      throw ApiError.notFound("Member not found in workspace")
    }

    const oldRole = member.role;
    member.role = roleFromBody;

    await workspace.save();

    // Log activity
    await logActivity({
      workspaceId: workspaceId,
      userId: userId,
      actionType: ActivityActionTypes.USER_JOINED,
      entityType: EntityTypes.USER,
      entityId: userIdFromBody,
      message: `Member role changed from ${oldRole} to ${roleFromBody}`,
      details: {
        userId: userIdFromBody,
        oldRole: oldRole,
        newRole: roleFromBody,
      },
    });

    return member;
};

export const leaveWorkspaceService = async (data: LeaveWorkspaceServiceInput) => {
  const { workspace, user, workspaceId } = data;

    const isMember = workspace.members.some((member: IWorkspaceMember) => member.user.toString() === user);
    if(!isMember){
      throw ApiError.notFound("Member not found")
    }
    workspace.members = workspace.members.filter(
      (member: IWorkspaceMember) => member.user.toString() !== user,
    );
    await workspace.save();

    // Log activity
    await logActivity({
      workspaceId: workspaceId,
      userId: user,
      actionType: ActivityActionTypes.USER_LEFT,
      entityType: EntityTypes.USER,
      entityId: user,
      message: `User left workspace`,
      details: {
        workspaceName: workspace.name,
      },
    });

    return workspace;
};

export const updateWorkspaceService = async (data: UpdateWorkspaceServiceInput) => {
  const { workspace, name, description, userId, workspaceId } = data;

  const oldName = workspace.name;
  const oldDescription = workspace.description;

  if (name !== undefined) {
    workspace.name = name;
  }

  if (description !== undefined) {
    workspace.description = description;
  }

  await workspace.save();

  // Log activity
  const changedFields = [];
  if (name !== undefined) changedFields.push('name');
  if (description !== undefined) changedFields.push('description');

  await logActivity({
    workspaceId: workspaceId,
    userId: userId,
    actionType: ActivityActionTypes.USER_JOINED,
    entityType: EntityTypes.WORKSPACE,
    entityId: workspace._id,
    message: `Workspace updated`,
    details: {
      changedFields,
      oldName,
      newName: workspace.name,
      oldDescription,
      newDescription: workspace.description,
    },
  });

  return workspace;
};

export const deleteWorkspaceServices = async(data: DeleteWorkspaceServiceInput)=>{
   const {workspace, userId, workspaceId} = data;

   // Log activity before deletion
   await logActivity({
     workspaceId: workspaceId,
     userId: userId,
     actionType: ActivityActionTypes.USER_LEFT,
     entityType: EntityTypes.WORKSPACE,
     entityId: workspace._id,
     message: `Workspace deleted`,
     details: {
       name: workspace.name,
     },
   });

   await Workspace.findByIdAndDelete(workspace._id)
   return;
}
