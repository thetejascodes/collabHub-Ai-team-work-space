import {Schema,Types,Document} from "mongoose";

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


