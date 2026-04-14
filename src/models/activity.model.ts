import {Types,Document,model,Schema} from 'mongoose'

export interface IActivityBase extends Document{
    workspaceId:Types.ObjectId;
    userId:Types.ObjectId;
    actionType:string;
    entityType:"WORKSPACE" | "Task" | "Comment" | "User" | "Project";
    entityId:Types.ObjectId;
    message:string;
}

export interface IActivity extends IActivityBase, Document {
    _id:Types.ObjectId;
    createdAt:Date;
    updatedAt:Date;

}
export const  ActivityActionTypes = {
    TASK_CREATED : "TASK_CREATED",
    TASK_UPDATED : "TASK_UPDATED",
    TASK_DELETED : "TASK_DELETED",
    COMMENT_ADDED : "COMMENT_ADDED",
    COMMENT_DELETED : "COMMENT_DELETED",
    USER_JOINED : "USER_JOINED",
    USER_LEFT : "USER_LEFT",
    PROJECT_CREATED : "PROJECT_CREATED",
    PROJECT_UPDATED : "PROJECT_UPDATED",
    PROJECT_DELETED : "PROJECT_DELETED"
} as const;


const activitySchema = new Schema<IActivity>({
    workspaceId:{
        type:Schema.Types.ObjectId,
        required:true,
        ref:'Workspace',
    },
    userId:{
        type:Schema.Types.ObjectId,
        required:true,
        ref:'User'
    },
    actionType:{
        type:String,
        enum:Object.values(ActivityActionTypes),
        required:true,
    },
    entityType:{
        type:String,
        enum:["WORKSPACE","Task","Comment","User","Project"],
        required:true,
    },
    entityId:{
        type:Schema.Types.ObjectId,
        required:true,
    },
    message:{
        type:String,
        required:true,
    },

},{timestamps:true})

export const Activity = model<IActivity>("Activity", activitySchema);

