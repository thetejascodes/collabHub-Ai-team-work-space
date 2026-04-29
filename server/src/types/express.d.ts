import type { HydratedDocument } from "mongoose";
import type { IWorkspaceDocument, IWorkspaceMember } from "../models/workspace.model.js";

declare global {
  namespace Express {
    interface AuthUser {
      userId: string;
      email?: string;
      name?: string;
      role?: string;
      iat?: number;
      exp?: number;
    }

    interface Request {
      user?: AuthUser;
      workspace?: HydratedDocument<IWorkspaceDocument>;
      workspaceMember?: IWorkspaceMember;
    }
  }
}

export {};
