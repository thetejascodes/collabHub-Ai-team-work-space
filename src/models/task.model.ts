import {Schema,Types,Document,model} from "mongoose";

export interface ITaskBase {
  title: string;
  description?: string;

  status: "todo" | "in-progress" | "done";
  priority: "low" | "medium" | "high";

  assignedTo?: Types.ObjectId;
  createdBy: Types.ObjectId;

  dueDate?: Date;
  completedAt?: Date;

  workspaceId: Types.ObjectId;
  projectId: Types.ObjectId;
}


export interface ITask extends ITaskBase, Document {
  _id: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const taskSchema = new Schema<ITask>({
  title:{
    type:String,
    required:true,
    trim:true,
  },
  description:{
    type:String,
    trim:true,
  },
  status:{
    type:String,
    enum:["todo" , "in-progress" , "done"],
    default:"todo",
  },
  priority:{
    type:String,
    enum:["low" , "medium" , "high"],
    default:"medium",
  },
  assignedTo: {
      type: Types.ObjectId,
      ref: "User",
      required: false,
    },

    createdBy: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },

    dueDate: {
      type: Date,
    },

    completedAt: {
      type: Date,
    },

    workspaceId: {
      type: Types.ObjectId,
      ref: "Workspace",
      required: true,
      index: true,
    },

    projectId: {
      type: Types.ObjectId,
      ref: "Project",
      required: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

taskSchema.index({ workspaceId: 1, projectId: 1 });

taskSchema.pre("save", async function () {
  if (this.isModified("status") && this.status === "done" && !this.completedAt) {
    this.completedAt = new Date();
  }
});

export const Task = model<ITask>("Task", taskSchema);