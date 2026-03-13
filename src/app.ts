import express from "express"
import cookieParser from "cookie-parser"
import authRoutes from "./routes/auth.routes.js"
import workspaceRoute from './routes/workspace.route.js'

const app = express()

app.use(express.json())
app.use(cookieParser())
app.use("/api/auth",authRoutes)
app.use('/api/workspace',workspaceRoute)

export default app