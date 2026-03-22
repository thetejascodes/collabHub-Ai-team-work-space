import { error } from "node:console";
import { Workspace } from "../models/workspace.model.js";
import mongoose from "mongoose";
import ApiError from "../utils/apiError.utils.js";
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
    throw ApiError.unauthorized("Only admin or owner can invite members")
  }

  if (!mongoose.Types.ObjectId.isValid(workspaceIdParams)) {
    throw ApiError.badRequest("Invalid workspace ID")
  }

  if (!userFromBody?.userId) {
    throw ApiError.badRequest("userId is required")
  }

  const workspaceById = await Workspace.findById(workspaceIdParams);

  if (!workspaceById) {
    throw ApiError.notFound("Workspace not found")
  }

  const userIdFromBody = userFromBody.userId;

  const alreadyMember = workspaceById.members.some(
    (member) => member.user.toString() === userIdFromBody,
  );

  if (alreadyMember) {
    throw ApiError.conflict("User is already member of workspace")
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
      throw ApiError.notFound("Workspace not found")
    }
    const memberExists = workspace.members.some(
      (m) => m.user.toString() === memberId,
    );

    if (!memberExists) {
      throw ApiError.notFound("Member not found in workspace")
    }

    workspace.members = workspace.members.filter(
      (m) => m.user.toString() !== memberId,
    );
    await workspace.save();
    return workspace;
  }
};

export const changeMemberRoleServices = async (data: any) => {
  const { userRole, workspaceId, userIdFromBody, roleFromBody } = data;

    if (userRole !== "admin") {
      throw ApiError.unauthorized("You are not allowed to change roles");
    }

    const workspace = await Workspace.findById(workspaceId);

    if (!workspace) {
      throw ApiError.notFound("Workspace not found")
    }

    const member = workspace.members.find(
      (m: any) => m.user.toString() === userIdFromBody,
    );

    if (!member) {
      throw ApiError.notFound("Member not found in workspace")
    }

    member.role = roleFromBody;

    await workspace.save();

    return member;
};

export const leaveWorkspaceService = async (data: any) => {
  const { workspaceId, user } = data;
    const workspace = await Workspace.findById(workspaceId);
    if (!workspace) {
      throw ApiError.notFound("Workspace not found")
    }

    const isMember = workspace.members.some((m) => m.user.toString() === user);
    if(!isMember){
      throw ApiError.notFound("Member not found")
    }
    workspace.members = workspace.members.filter(
      (member) => member.user.toString() !== user,
    );
    await workspace.save();
    return workspace;
};

export const deleteWorkspaceServices = async(data:any)=>{
   const {workspaceId,userId} = data;
    const workspace = await Workspace.findById(workspaceId)
    if(!workspace){
      throw ApiError.notFound('workspace not found')
    }
    if(workspace.owner.toString() !== userId){
      throw ApiError.unauthorized('Unauthorized: Only owner can delete workspace')
    }
    await Workspace.findByIdAndDelete(workspaceId)
    return;
}