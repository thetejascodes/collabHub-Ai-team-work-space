import express from "express"
import cookieParser from "cookie-parser"
import authRoutes from "./routes/auth.routes.js"
import workspaceRoutes from './routes/workspace.route.js'
import projectRoutes from './routes/project.routes.js'
import taskRoutes from "./routes/task.routes.js"
import activityRoutes from "./routes/activity.routes.js"
import commentRoutes from "./routes/comment.routes.js"
import notificationRoutes from "./routes/notification.routes.js"
import { errorHandler } from "./middleware/errorHandler.middleware.js"

const app = express()

app.use(express.json())
app.use(cookieParser())
app.use("/api/auth",authRoutes)
app.use('/api/workspace',workspaceRoutes)
app.use('/api/project',projectRoutes)
app.use('/api/task',taskRoutes)
app.use('/api/workspaces',activityRoutes)
app.use('/api/tasks/:taskId/comments',commentRoutes)
app.use('/api/notifications', notificationRoutes)

app.use(errorHandler)

export default app
