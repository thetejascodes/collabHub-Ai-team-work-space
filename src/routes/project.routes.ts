import  { Router } from 'express'
import { authMiddleware } from '../middleware/auth.middleware.js'
import { createProject, deleteProject, getProject, getProjectsController, updateProject } from '../controllers/project.controllers.js'
import { checkWorkspaceAccess } from '../middleware/checkWorkspaceAccess.middleware.js'

const router = Router()

router.post('/projects',authMiddleware,checkWorkspaceAccess(),createProject)
router.get('/workspace/:workspaceId/projects',authMiddleware,checkWorkspaceAccess(),getProjectsController)
router.get('/projects/:projectId',authMiddleware,checkWorkspaceAccess(),getProject)
router.patch('/projects/:projectId',authMiddleware,checkWorkspaceAccess(['owner','admin']),updateProject)
router.delete('/projects/:projectId',authMiddleware,checkWorkspaceAccess(['owner','admin']),deleteProject)

export default router;
