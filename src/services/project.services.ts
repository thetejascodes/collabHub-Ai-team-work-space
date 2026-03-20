import mongoose from "mongoose";
import { Project } from "../models/project.model.js";
import { Workspace } from "../models/workspace.model.js";

export const createProjectService = async (data: any) => {
  try {
    const { user, parsed} = data;
    const workspace = await Workspace.findById(parsed.data.workspaceId)
    if(!workspace){
        throw new Error('Workspace not found')
    }
    const userIsMemberOfWorkspace =  workspace.members.some(member => member.user.toString() === user.userId)
    if(!userIsMemberOfWorkspace){
        throw new Error('User is not member of workspace')
    }
    const project = await Project.create(parsed.data)
    return project;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
