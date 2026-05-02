import type { Request, Response, NextFunction } from 'express'
import { createCommentService, getCommentService, deleteCommentService, getCommentsService, updateCommentService } from '../services/comment.services.js'

export const createComment = async (req:Request,res:Response,next:NextFunction) =>{
    try {
        const taskId = req.params.taskId as string;
        const { type, content, mentions, parentCommentId, attachments } = req.body;
        const workspaceId = req.workspace?.id as string;
        const userId = req.user?.userId;
        if(!workspaceId || !userId) throw new Error('Workspace ID and User ID are required');
        const comment = await createCommentService({
          taskId,
          workspaceId,
          userId,
          type,
          content,
          mentions: Array.isArray(mentions) ? mentions : [],
          parentCommentId,
          attachments,
        });
        res.status(201).json({success:true,data:comment});
    } catch (error) {
        next(error);
    }
}

export const getComments = async (req:Request,res:Response,next:NextFunction)=>{
    try {
        const taskId = req.params.taskId as string;
        const page = Number(req.query.page ?? 1);
        const limit = Number(req.query.limit ?? 20);
        const sortBy = String(req.query.sortBy ?? 'createdAt');
        const order = String(req.query.order ?? 'desc') as 'asc' | 'desc';
        const parentCommentId = req.query.parentCommentId as string | undefined;

        const result = await getCommentsService(taskId, {
          page,
          limit,
          sortBy,
          order,
          parentCommentId,
        });

        res.status(200).json({success:true,data:result});
    } catch (error) {
        next(error);
    }
}

export const getComment = async (req:Request,res:Response,next:NextFunction)=>{
    try {
        const taskId = req.params.taskId as string;
        const commentId = req.params.commentId as string;
        const comment = await getCommentService(taskId, commentId)
        res.status(200).json({success:true,data:comment})
    } catch (error) {
        next(error);        
    }
}

export const updateComment = async (req:Request,res:Response,next:NextFunction)=>{
    try {
        const taskId = req.params.taskId as string;
        const commentId = req.params.commentId as string;
        const { content, mentions, attachments, type } = req.body;
        const userId = req.user?.userId;
        if(!userId) throw new Error('User ID is required');

        const comment = await updateCommentService(taskId, commentId, userId, {
          content,
          mentions: Array.isArray(mentions) ? (mentions as string[]) : undefined,
          attachments: Array.isArray(attachments)
            ? (attachments as { filename:string; url:string; mimeType?:string; size?:number }[])
            : undefined,
          type,
        });

        res.status(200).json({success:true,data:comment});
    } catch (error) {
        next(error);
    }
}

export const deleteComment = async (req:Request,res:Response,next:NextFunction)=>{
    try {
        const taskId = req.params.taskId as string;
        const commentId = req.params.commentId as string;
        await deleteCommentService(taskId, commentId);
        res.status(204).send();
    } catch (error) {
        next(error);
    }
}
