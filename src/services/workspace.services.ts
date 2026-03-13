import {Workspace} from '../models/workspace.model.js'
export const createWorkspace = async (data: any) => {
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