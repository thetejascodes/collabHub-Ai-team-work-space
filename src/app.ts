import express from "express"
import cookieParser from "cookie-parser"
import authRoutes from "./routes/auth.routes.js"
import workspaceRoutes from './routes/workspace.route.js'
import projectRoutes from './routes/project.routes.js'
import taskRoutes from "./routes/task.routes.js"
import { errorHandler } from "./middleware/errorHandler.middleware.js"

const app = express()

app.use(express.json())
app.use(cookieParser())
app.use("/api/auth",authRoutes)
app.use('/api/workspace',workspaceRoutes)
app.use('/api/project',projectRoutes)
app.use('/api/task',taskRoutes)


app.use(errorHandler)

export default app
