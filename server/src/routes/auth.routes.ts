import express from "express"
import { register,login,getMyProfile } from "../controllers/auth.controller.js"
import { authMiddleware } from "../middleware/auth.middleware.js"

const router = express.Router()

router.post("/register",register)

router.post("/login",login)
router.get("/me",authMiddleware,getMyProfile)

export default router;