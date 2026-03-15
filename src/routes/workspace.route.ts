import {Router} from 'express'
import {createWorkspace,getMyWorkspace, getWorkspaceById, inviteWorkspaceMember} from '../controllers/workspace.controller.js'
import { authMiddleware } from '../middleware/auth.middleware.js'

const router = Router()

router.post('/create',authMiddleware,createWorkspace)
router.get('/myworkspaces',authMiddleware,getMyWorkspace)
router.get('/getWorkpace/:workspaceId',authMiddleware,getWorkspaceById)
router.post('/invite/:workspaceId',authMiddleware,inviteWorkspaceMember)
export default router