import {Types,Document,model,Schema} from 'mongoose'

export const ActivityActionTypes = {
    TASK_CREATED : "TASK_CREATED",
    TASK_UPDATED : "TASK_UPDATED",
    TASK_DELETED : "TASK_DELETED",
    COMMENT_ADDED : "COMMENT_ADDED",
    COMMENT_UPDATED : "COMMENT_UPDATED",
    COMMENT_DELETED : "COMMENT_DELETED",
    USER_JOINED : "USER_JOINED",
    USER_LEFT : "USER_LEFT",
    PROJECT_CREATED : "PROJECT_CREATED",
    PROJECT_UPDATED : "PROJECT_UPDATED",
    PROJECT_DELETED : "PROJECT_DELETED",
    WORKSPACE_CREATED : "WORKSPACE_CREATED",
    WORKSPACE_UPDATED : "WORKSPACE_UPDATED",
    WORKSPACE_DELETED : "WORKSPACE_DELETED",
    MEMBER_ROLE_CHANGED : "MEMBER_ROLE_CHANGED"
} as const;

export type ActionType = typeof ActivityActionTypes[keyof typeof ActivityActionTypes];

export const EntityTypes = {
    WORKSPACE: "WORKSPACE",
    TASK: "TASK",
    COMMENT: "COMMENT",
    USER: "USER",
    PROJECT: "PROJECT"
} as const;

export type EntityType = typeof EntityTypes[keyof typeof EntityTypes];

export interface IActivityBase extends Document{
    workspaceId:Types.ObjectId;
    userId:Types.ObjectId;
    actionType: ActionType;
    entityType: EntityType;
    entityId:Types.ObjectId;
    message:string;
    details?: Record<string, any>;
    isRead?: boolean;
    metadata?: Record<string, any>;
}

export interface IActivity extends IActivityBase, Document {
    _id:Types.ObjectId;
    createdAt:Date;
    updatedAt:Date;
}

const activitySchema = new Schema<IActivity>({
    workspaceId:{
        type:Schema.Types.ObjectId,
        required:true,
        ref:'Workspace',
        index: true
    },
    userId:{
        type:Schema.Types.ObjectId,
        required:true,
        ref:'User',
        index: true
    },
    actionType:{
        type:String,
        enum:Object.values(ActivityActionTypes),
        required:true,
    },
    entityType:{
        type:String,
        enum:Object.values(EntityTypes),
        required:true,
    },
    entityId:{
        type:Schema.Types.ObjectId,
        required:true,
    },
    message:{
        type:String,
        required:true,
        trim: true,
        minlength: 1,
        maxlength: 500
    },
    details:{
        type: Schema.Types.Mixed,
        default: null
    },
    isRead:{
        type: Boolean,
        default: false,
        index: true
    },
    metadata:{
        type: Schema.Types.Mixed,
        default: null
    }
},{timestamps:true})


activitySchema.index({ workspaceId: 1, createdAt: -1 });
activitySchema.index({ userId: 1, createdAt: -1 });
activitySchema.index({ workspaceId: 1, isRead: 1 });

export const Activity = model<IActivity>("Activity", activitySchema);

