import { Schema, Types, model, Document } from "mongoose";

export interface IProjectCreate {
  name: string;
  description?: string;
  workspaceId: Types.ObjectId;
  leadId?: Types.ObjectId;
  settings?: Record<string, any>;
}

export interface IProject extends IProjectCreate, Document {
  _id: Types.ObjectId;
}

const projectSchema = new Schema<IProject>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    workspaceId: {
      type: Schema.Types.ObjectId,
      ref: "Workspace",
      required: true,
      index: true,
    },
    leadId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    settings: {
      type: Object, 
      default: {},
    },
  },
  { timestamps: true }
);

export const Project = model<IProject>("Project", projectSchema);