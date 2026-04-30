import type { Request,Response,NextFunction } from 'express'
import {createCommentService, getCommentService,deleteCommentService} from '../services/comment.services.js'

export const createComment = async (req:Request,res:Response,next:NextFunction) =>{
    try {
        const taskId = req.params.taskId as string;
        const {type,content,mentions} = req.body;
        const workspaceId = req.workspace?.id as string;
        const userId = req.user?.userId;
        if(!workspaceId || !userId) throw new Error('Workspace ID and User ID are required');
        const comment = await createCommentService({taskId,workspaceId,userId,type,content,mentions});
        res.status(201).json({success:true,data:comment});
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

export const deleteComment = async (req:Request,res:Response,next:NextFunction)=>{
    try {
        const taskId = req.params.taskId as string;
        const commentId = req.params.commentId as string;
        const comment = await deleteCommentService(taskId, commentId);
        res.status(204)
    } catch (error) {
        next(error);
    }
}