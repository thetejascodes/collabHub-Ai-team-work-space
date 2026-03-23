import  { Router } from 'express'
import { authMiddleware } from '../middleware/auth.middleware.js'
import { createProject, getProject, getProjectsController } from '../controllers/project.controllers.js'
import { checkWorkspaceAccess } from '../middleware/checkWorkspaceAccess.middleware.js'

const router = Router()

router.post('/projects',authMiddleware,checkWorkspaceAccess(),createProject)
router.get('/workspace/:workspaceId/projects',authMiddleware,checkWorkspaceAccess(),getProjectsController)
router.get('/projects/:projectId',authMiddleware,getProject)

export default router;
