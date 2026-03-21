import  { Router } from 'express'
import { authMiddleware } from '../middleware/auth.middleware.js'
import { createProject, getProjectsController } from '../controllers/project.controllers.js'

const router = Router()

router.post('/projects',authMiddleware,createProject)
router.get('/workspace/:workspaceId/projects',authMiddleware,getProjectsController)

export default router;