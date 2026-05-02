import { createComment, deleteComment, getComment, getComments, updateComment } from "../controllers/comment.controllers.js";
import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { checkWorkspaceAccess } from "../middleware/checkWorkspaceAccess.middleware.js";

const router = Router({ mergeParams: true });

router.post('/', authMiddleware, checkWorkspaceAccess(), createComment);
router.get('/', authMiddleware, checkWorkspaceAccess(), getComments);
router.get('/:commentId', authMiddleware, checkWorkspaceAccess(), getComment);
router.patch('/:commentId', authMiddleware, checkWorkspaceAccess(), updateComment);
router.delete('/:commentId', authMiddleware, checkWorkspaceAccess(), deleteComment);

export default router;
