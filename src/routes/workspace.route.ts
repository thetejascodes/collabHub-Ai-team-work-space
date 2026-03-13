import {Router} from 'express'
import {createWorkspace} from '../controllers/workspace.controller.js'
import { authMiddleware } from '../middleware/auth.middleware.js'

const router = Router()

router.post("/create",authMiddleware,createWorkspace)

export default router