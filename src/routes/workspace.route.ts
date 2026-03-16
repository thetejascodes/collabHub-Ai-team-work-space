import {Router} from 'express'
import {createWorkspace,getMyWorkspace, getWorkspaceById, inviteWorkspaceMember} from '../controllers/workspace.controller.js'
import { authMiddleware } from '../middleware/auth.middleware.js'

const router = Router()
router.use(authMiddleware)

router.post('/workspaces',createWorkspace)
router.get('/workspaces/my',getMyWorkspace)
router.get('/workspaces/:workspaceId',getWorkspaceById)
router.post('/workspaces/:workspaceId/invite',inviteWorkspaceMember)
export default router

