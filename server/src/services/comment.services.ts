import { Comment } from "../models/comment.model.js";
import { Task } from "../models/task.model.js";
import ApiError from "../utils/apiError.utils.js";

interface createCommentInput {
    taskId:string;
    workspaceId:string;
    userId:string;
    type:string;
    content:string;
    mentions:string[];
}
export const createCommentService = async(data:createCommentInput)=>{
    const {taskId,workspaceId,userId,type,content,mentions} = data;
    const task = await Task.findById(taskId).select("workspaceId").lean();
    if(!task) throw new ApiError(404,'Task not found');
    if(task.workspaceId.toString() !== workspaceId) {
        throw new ApiError(403,'Task does not belong to this workspace');
    }
    const comment  = await Comment.create({taskId,workspaceId,userId,type,content,mentions})
    if(!comment) throw new ApiError(500,'Failed to create comment');
    return comment;
}

export const getCommentService = async(taskId:string, commentId:string)=>{
    const comment = await Comment.findOne({ _id: commentId, taskId })
    if(!comment) throw new ApiError(404,'Comment not found');
    return comment;
}

export const deleteCommentService = async(taskId:string,commentId:string)=>{
    const comment = await Comment.findByIdAndDelete({_id:commentId,taskId})
    if(!comment) throw new ApiError(404,'Comment not found');
    return comment;
}