import {Workspace} from '../models/workspace.model.js'
export const createWorkspaceService = async (data: any) => {
  const workspace = await Workspace.create({
    name: data.name,
    description: data.description,
    owner: data.owner,
    members: [ {
        user: data.owner,
        role: "admin"
      }],
  });
  return workspace;
};

export const getMyWorkspaceService = async (userId: string)=>{
  const myWorkspaces = await Workspace.find({
    $or:[
      {owner: userId},
      {"members.user":userId},
    ]
  }).populate("owner","name email")
  .lean();

  return myWorkspaces;
};







