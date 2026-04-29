import {Router} from 'express'
import {changeMemberRole, createWorkspace,deleteWorkspace,getMyWorkspace, getWorkspaceById, inviteWorkspaceMember, leaveWorkspace, removeMemberFromWorkspace, updateWorkspace} from '../controllers/workspace.controller.js'
import { authMiddleware } from '../middleware/auth.middleware.js'
import { checkWorkspaceAccess } from '../middleware/checkWorkspaceAccess.middleware.js'

const router = Router()
router.use(authMiddleware)

router.post('/workspaces',createWorkspace)
router.get('/workspaces/my',getMyWorkspace)
router.get('/workspaces/:workspaceId',checkWorkspaceAccess(),getWorkspaceById)
router.patch('/workspaces/:workspaceId',checkWorkspaceAccess(['owner', 'admin']),updateWorkspace)
router.post('/workspaces/:workspaceId/invite',checkWorkspaceAccess(["owner", "admin"]),inviteWorkspaceMember)
router.delete('/:workspaceId/member/:memberId',checkWorkspaceAccess(["owner", "admin"]),removeMemberFromWorkspace)
router.patch('/:workspaceId/member-role',checkWorkspaceAccess(['owner']),changeMemberRole)
router.post('/:workspaceId/leave',checkWorkspaceAccess(),leaveWorkspace)
router.delete('/:workspaceId/delete',checkWorkspaceAccess(['owner']),deleteWorkspace)
export default router

