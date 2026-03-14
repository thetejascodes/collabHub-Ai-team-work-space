import {Router} from 'express'
import {createWorkspace,getMyWorkspace} from '../controllers/workspace.controller.js'
import { authMiddleware } from '../middleware/auth.middleware.js'

const router = Router()

router.post('/create',authMiddleware,createWorkspace)
router.get('/myworkspaces',authMiddleware,getMyWorkspace)

export default router