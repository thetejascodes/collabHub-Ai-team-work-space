import { createComment, deleteComment, getComment } from "../controllers/comment.controllers.js";
import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { checkWorkspaceAccess } from "../middleware/checkWorkspaceAccess.middleware.js";

const router = Router({ mergeParams: true });

router.post('/',authMiddleware,checkWorkspaceAccess(),createComment)
router.get('/:commentId',authMiddleware,checkWorkspaceAccess(),getComment)
router.delete('/:commentId',authMiddleware,checkWorkspaceAccess(),deleteComment)
export default router;
