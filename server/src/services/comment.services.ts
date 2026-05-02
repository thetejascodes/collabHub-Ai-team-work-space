import { Types } from 'mongoose';
import { Comment } from "../models/comment.model.js";
import { Task } from "../models/task.model.js";
import { Activity, ActivityActionTypes, EntityTypes } from "../models/activity.model.js";
import eventBus from "../utils/eventBus.js";
import ApiError from "../utils/apiError.utils.js";

interface createCommentInput {
    taskId:string;
    workspaceId:string;
    userId:string;
    parentCommentId?:string;
    type:string;
    content:string;
    mentions:string[];
    attachments?: { filename:string; url:string; mimeType?:string; size?:number }[];
}

interface GetCommentsQuery {
    page?: number;
    limit?: number;
    sortBy?: string;
    order?: 'asc' | 'desc';
    parentCommentId?: string | undefined;
}

export const createCommentService = async(data:createCommentInput)=>{
    const { taskId, workspaceId, userId, parentCommentId, type, content, mentions, attachments } = data;

    const task = await Task.findById(taskId).select("workspaceId assignedTo title").lean();
    if(!task) throw new ApiError(404,'Task not found');
    if(task.workspaceId.toString() !== workspaceId) {
        throw new ApiError(403,'Task does not belong to this workspace');
    }

    if (parentCommentId) {
      if (!Types.ObjectId.isValid(parentCommentId)) {
        throw new ApiError(400, 'Invalid parentCommentId');
      }
      const parentComment = await Comment.findOne({ _id: parentCommentId, taskId }).lean();
      if (!parentComment) {
        throw new ApiError(404, 'Parent comment not found');
      }
    }

    const commentPayload: Record<string, any> = {
      taskId,
      workspaceId,
      userId,
      type,
      content,
      mentions,
    };

    if (parentCommentId) {
      commentPayload.parentCommentId = new Types.ObjectId(parentCommentId);
    }

    if (attachments) {
      commentPayload.attachments = attachments;
    }

    const comment = await Comment.create(commentPayload as any);
    if(!comment) throw new ApiError(500,'Failed to create comment');

    await Activity.create({
      workspaceId: comment.workspaceId,
      userId: comment.userId,
      actionType: ActivityActionTypes.COMMENT_ADDED,
      entityType: EntityTypes.COMMENT,
      entityId: comment._id,
      message: `Comment added to task ${task.title}`,
      details: {
        taskId: comment.taskId,
        parentCommentId: comment.parentCommentId,
      },
    });

    eventBus.emit('comment.created', comment);
    return comment;
}

export const getCommentsService = async(taskId:string, query:GetCommentsQuery)=>{
    const page = query.page && query.page > 0 ? query.page : 1;
    const limit = query.limit && query.limit > 0 ? query.limit : 20;
    const sortBy = query.sortBy || 'createdAt';
    const order = query.order === 'asc' ? 1 : -1;
    const parentCommentFilter = query.parentCommentId ?? undefined;

    const filter: Record<string, any> = { taskId };
    if (typeof parentCommentFilter === 'string') {
      filter.parentCommentId = parentCommentFilter === 'null' ? { $exists: false } : parentCommentFilter;
    } else {
      filter.parentCommentId = { $exists: false };
    }

    const total = await Comment.countDocuments(filter);
    const comments = await Comment.find(filter)
      .sort({ [sortBy]: order, _id: 1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate('userId', 'name email')
      .populate({ path: 'replies', populate: { path: 'userId', select: 'name email' } });

    return {
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit) || 1,
      },
      data: comments,
    };
}

export const getCommentService = async(taskId:string, commentId:string)=>{
    if (!Types.ObjectId.isValid(commentId)) {
      throw new ApiError(400, 'Invalid commentId');
    }

    const comment = await Comment.findOne({ _id: commentId, taskId })
      .populate('userId', 'name email')
      .populate({ path: 'replies', populate: { path: 'userId', select: 'name email' } });
    if(!comment) throw new ApiError(404,'Comment not found');
    return comment;
}

export const updateCommentService = async(taskId:string, commentId:string, userId:string, data: { content?: string | undefined; mentions?: string[] | undefined; attachments?: { filename:string; url:string; mimeType?:string; size?:number }[] | undefined; type?: string | undefined })=>{
    if (!Types.ObjectId.isValid(commentId)) {
      throw new ApiError(400, 'Invalid commentId');
    }

    const comment = await Comment.findOne({ _id: commentId, taskId });
    if(!comment) throw new ApiError(404,'Comment not found');
    if (comment.userId.toString() !== userId) {
      throw new ApiError(403, 'You do not have permission to edit this comment');
    }

    const updateData: Record<string, any> = {};
    if (typeof data.content === 'string') updateData.content = data.content.trim();
    if (Array.isArray(data.mentions)) updateData.mentions = data.mentions;
    if (Array.isArray(data.attachments)) updateData.attachments = data.attachments;
    if (typeof data.type === 'string') updateData.type = data.type;

    if (Object.keys(updateData).length === 0) {
      return comment;
    }

    const updatedComment = await Comment.findOneAndUpdate(
      { _id: commentId, taskId },
      { $set: updateData },
      { new: true },
    );

    if (!updatedComment) {
      throw new ApiError(500, 'Failed to update comment');
    }

    await Activity.create({
      workspaceId: updatedComment.workspaceId,
      userId: updatedComment.userId,
      actionType: ActivityActionTypes.COMMENT_UPDATED,
      entityType: EntityTypes.COMMENT,
      entityId: updatedComment._id,
      message: `Comment updated on task ${taskId}`,
      details: {
        taskId: updatedComment.taskId,
        parentCommentId: updatedComment.parentCommentId,
      },
    });

    eventBus.emit('comment.updated', updatedComment);
    return updatedComment;
}

export const deleteCommentService = async(taskId:string,commentId:string)=>{
    if (!Types.ObjectId.isValid(commentId)) {
      throw new ApiError(400, 'Invalid commentId');
    }

    const comment = await Comment.findOneAndDelete({ _id: commentId, taskId });
    if(!comment) throw new ApiError(404,'Comment not found');

    await Comment.deleteMany({ parentCommentId: comment._id });

    await Activity.create({
      workspaceId: comment.workspaceId,
      userId: comment.userId,
      actionType: ActivityActionTypes.COMMENT_DELETED,
      entityType: EntityTypes.COMMENT,
      entityId: comment._id,
      message: `Comment deleted from task ${taskId}`,
      details: {
        taskId: comment.taskId,
      },
    });

    eventBus.emit('comment.deleted', comment);
    return comment;
}