import {Router} from 'express'
import {createWorkspace,getMyWorkspace, getWorkspaceById} from '../controllers/workspace.controller.js'
import { authMiddleware } from '../middleware/auth.middleware.js'

const router = Router()

router.post('/create',authMiddleware,createWorkspace)
router.get('/myworkspaces',authMiddleware,getMyWorkspace)
router.get('/getWorkpace/:workspaceId',authMiddleware,getWorkspaceById)

export default router