import { Schema, model, Document, Types } from "mongoose";

export interface IWorkspaceMember {
  user: Types.ObjectId;
  role: "admin" | "member";
  joinedAt: Date;
}

export interface IWorkspace {
  name: string;
  description?: string;
  owner: Types.ObjectId;
  members: IWorkspaceMember[];
  isActive: boolean;
  settings?: Record<string, any>;
}

export interface IWorkspaceDocument extends IWorkspace, Document {}

const workspaceMemberSchema = new Schema<IWorkspaceMember>({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  role: {
    type: String,
    enum: ["admin", "member"],
    default: "member",
  },
  joinedAt: {
    type: Date,
    default: Date.now,
  },
});

const workspaceSchema = new Schema<IWorkspaceDocument>(
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
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    members: [workspaceMemberSchema],
    isActive: {
      type: Boolean,
      default: true,
    },
    settings: {
      type: Schema.Types.Mixed,
      default: {},
    },
  },
  { timestamps: true },
);

workspaceSchema.pre('save', async function () {
    if(this.isNew){
        const ownerExist = this.members.some(m => m.user.equals(this.owner));
        if(!ownerExist){
            this.members.push({
                user:this.owner,
                role:'admin',
                joinedAt:new Date()
            });
        }
    }
})

export const Workspace = model<IWorkspaceDocument>('Workspace',workspaceSchema) 
