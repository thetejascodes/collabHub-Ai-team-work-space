import  { Router } from 'express'
import { authMiddleware } from '../middleware/auth.middleware.js'
import { createProject } from '../controllers/project.controllers.js'

const router = Router()

router.post('/projects',authMiddleware,createProject)


export default router;