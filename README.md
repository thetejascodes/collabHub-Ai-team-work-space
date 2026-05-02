# CollabHub - AI Team Work Space

A comprehensive backend server for collaborative team workspace management with AI integration capabilities. Built with **Node.js**, **Express.js**, **TypeScript**, and **MongoDB**, this platform enables teams to organize projects, manage tasks, track activities, and collaborate seamlessly.

---

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Environment Setup](#environment-setup)
- [Running the Server](#running-the-server)
- [API Endpoints](#api-endpoints)
- [Database Models](#database-models)
- [Authentication](#authentication)
- [Middleware](#middleware)
- [Contributing](#contributing)
- [License](#license)

---

## ✨ Features

### Core Functionality
- **User Authentication & Authorization** - Secure sign-up, login, and JWT-based authentication
- **Role-Based Access Control** - Support for user, member, and admin roles
- **Workspace Management** - Create and manage multiple workspaces with team members
- **Project Management** - Organize work into projects within workspaces
- **Task Management** - Create, assign, and track tasks with status updates
- **Comments & Discussions** - Add comments to tasks for team collaboration
- **Activity Tracking** - Monitor all workspace activities and changes
- **Middleware Protection** - Secure routes with authentication and workspace access validation
- **Error Handling** - Centralized error handling with meaningful error responses

---

## 🛠 Tech Stack

| Technology | Purpose |
|-----------|---------|
| **Node.js** | JavaScript runtime |
| **Express.js** | Web framework |
| **TypeScript** | Type-safe development |
| **MongoDB** | NoSQL database |
| **Mongoose** | MongoDB ODM |
| **JWT (jsonwebtoken)** | Authentication |
| **Bcrypt** | Password hashing |
| **Zod** | Schema validation |
| **Cookie-Parser** | Cookie handling |
| **dotenv** | Environment configuration |

---

## 📁 Project Structure

```
server/
├── src/
│   ├── app.ts                 # Express app configuration
│   ├── server.ts              # Server entry point
│   ├── config/
│   │   └── db.ts              # MongoDB connection setup
│   ├── controllers/           # Route handlers
│   │   ├── auth.controller.ts
│   │   ├── activity.controller.ts
│   │   ├── comment.controllers.ts
│   │   ├── project.controllers.ts
│   │   ├── task.controller.ts
│   │   └── workspace.controller.ts
│   ├── middleware/            # Express middlewares
│   │   ├── auth.middleware.ts
│   │   ├── checkWorkspaceAccess.middleware.ts
│   │   └── errorHandler.middleware.ts
│   ├── models/                # Mongoose schemas
│   │   ├── activity.model.ts
│   │   ├── comment.model.ts
│   │   ├── project.model.ts
│   │   ├── task.model.ts
│   │   ├── user.model.ts
│   │   └── workspace.model.ts
│   ├── routes/                # API route definitions
│   │   ├── auth.routes.ts
│   │   ├── activity.routes.ts
│   │   ├── comment.routes.ts
│   │   ├── project.routes.ts
│   │   ├── task.routes.ts
│   │   └── workspace.route.ts
│   ├── services/              # Business logic
│   │   ├── auth.services.ts
│   │   ├── activity.services.ts
│   │   ├── comment.services.ts
│   │   ├── project.services.ts
│   │   ├── task.services.ts
│   │   └── workspace.services.ts
│   ├── types/
│   │   └── express.d.ts       # TypeScript type definitions
│   ├── utils/                 # Utility functions
│   │   ├── apiError.utils.ts
│   │   └── jwt.ts
│   └── validators/            # Input validation schemas
│       ├── project.validator.ts
│       ├── task.validator.ts
│       ├── validators.user.ts
│       └── workspace.validator.ts
├── package.json
├── tsconfig.json
└── README.md
```

---

## 🚀 Installation

### Prerequisites
- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **MongoDB** (local or Atlas)

### Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd collabHub-Ai-team-work-space/server
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create environment file**
   ```bash
   cp .env.example .env
   ```

---

## 🔧 Environment Setup

Create a `.env` file in the `server` directory with the following variables:

```env
# Server Configuration
PORT=8080
NODE_ENV=development

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/collabhub
# OR for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/collabhub

# JWT Configuration
JWT_SECRET=your-secret-key-here
JWT_EXPIRY=7d

# CORS Configuration (optional)
CORS_ORIGIN=http://localhost:3000
```

### Database Setup

**Local MongoDB:**
```bash
# Start MongoDB service
mongod
```

**MongoDB Atlas (Cloud):**
1. Create account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a cluster
3. Get connection string
4. Update `MONGODB_URI` in `.env`

---

## 📦 Running the Server

### Development Mode
```bash
npm run dev
```

This will:
- Start the server with TypeScript watching enabled
- Recompile and restart on file changes
- Run on the port specified in `.env` (default: 8080)

### Production Build
```bash
npm run build
node dist/server.js
```

---

## 🔌 API Endpoints

### Base URL
```
http://localhost:8080/api
```

### Authentication Routes
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/signup` | Register a new user |
| POST | `/auth/login` | Login user |
| POST | `/auth/logout` | Logout user |
| POST | `/auth/refresh` | Refresh JWT token |

### Workspace Routes
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/workspace` | Get all workspaces |
| POST | `/workspace` | Create new workspace |
| GET | `/workspace/:id` | Get workspace details |
| PUT | `/workspace/:id` | Update workspace |
| DELETE | `/workspace/:id` | Delete workspace |
| POST | `/workspace/:id/members` | Add member to workspace |
| DELETE | `/workspace/:id/members/:memberId` | Remove member |

### Project Routes
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/project` | Get all projects |
| POST | `/project` | Create new project |
| GET | `/project/:id` | Get project details |
| PUT | `/project/:id` | Update project |
| DELETE | `/project/:id` | Delete project |

### Task Routes
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/task` | Get all tasks |
| POST | `/task` | Create new task |
| GET | `/task/:id` | Get task details |
| PUT | `/task/:id` | Update task |
| DELETE | `/task/:id` | Delete task |

### Activity Routes
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/workspaces` | Get workspace activities |
| GET | `/workspaces/:workspaceId` | Get specific workspace activity |

### Comment Routes
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/tasks/:taskId/comments` | Get task comments |
| POST | `/tasks/:taskId/comments` | Add comment |
| DELETE | `/tasks/:taskId/comments/:commentId` | Delete comment |

---

## 💾 Database Models

### User Model
```typescript
{
  name: string,
  email: string (unique),
  password: string (hashed),
  role: "user" | "member" | "admin",
  isVerified: boolean,
  timestamps: true
}
```

### Workspace Model
```typescript
{
  name: string,
  description?: string,
  owner: ObjectId (User),
  members: [{
    user: ObjectId (User),
    role: "owner" | "admin" | "member",
    joinedAt: Date
  }],
  isActive: boolean,
  settings?: Record<string, any>,
  timestamps: true
}
```

### Project Model
```typescript
{
  name: string,
  description?: string,
  workspace: ObjectId (Workspace),
  owner: ObjectId (User),
  status: string,
  timestamps: true
}
```

### Task Model
```typescript
{
  title: string,
  description?: string,
  project: ObjectId (Project),
  assignee: ObjectId (User),
  status: string,
  priority: string,
  dueDate?: Date,
  timestamps: true
}
```

### Comment Model
```typescript
{
  content: string,
  task: ObjectId (Task),
  author: ObjectId (User),
  timestamps: true
}
```

### Activity Model
```typescript
{
  type: string,
  description: string,
  workspace: ObjectId (Workspace),
  user: ObjectId (User),
  metadata?: Record<string, any>,
  timestamps: true
}
```

---

## 🔐 Authentication

### How It Works

1. **User Registration**
   - User provides name, email, and password
   - Password is hashed using Bcrypt (salt rounds: 10)
   - User is stored in database with role "user"

2. **User Login**
   - User provides email and password
   - Password is compared with hashed password
   - JWT token is issued with 7-day expiry
   - Token stored in HTTP-only cookie

3. **Protected Routes**
   - JWT token extracted from cookies
   - Token verified using `auth.middleware.ts`
   - User ID attached to request object
   - Request proceeds or fails based on token validity

### JWT Structure
```json
{
  "id": "user_id",
  "email": "user@example.com",
  "role": "admin",
  "iat": 1234567890,
  "exp": 1234567890
}
```

---

## 🛡️ Middleware

### Auth Middleware (`auth.middleware.ts`)
- Verifies JWT token from cookies
- Attaches user info to request
- Returns 401 if token invalid/missing

### Workspace Access Middleware (`checkWorkspaceAccess.middleware.ts`)
- Verifies user is member of workspace
- Checks user's role in workspace
- Prevents unauthorized access to workspace resources

### Error Handler Middleware (`errorHandler.middleware.ts`)
- Centralized error handling
- Formats error responses
- Logs errors for debugging
- Returns appropriate HTTP status codes

---

## 🔍 Validation

The project uses **Zod** for schema validation:

- `project.validator.ts` - Project creation/update validation
- `task.validator.ts` - Task creation/update validation
- `validators.user.ts` - User registration/login validation
- `workspace.validator.ts` - Workspace creation/update validation

---

## 📝 Example API Usage

### Sign Up
```bash
curl -X POST http://localhost:8080/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "securePassword123"
  }'
```

### Create Workspace
```bash
curl -X POST http://localhost:8080/api/workspace \
  -H "Content-Type: application/json" \
  -H "Cookie: jwt=your_token_here" \
  -d '{
    "name": "My Workspace",
    "description": "Team collaboration space"
  }'
```

### Create Task
```bash
curl -X POST http://localhost:8080/api/task \
  -H "Content-Type: application/json" \
  -H "Cookie: jwt=your_token_here" \
  -d '{
    "title": "Fix login bug",
    "description": "Users report login issues",
    "projectId": "project_id_here",
    "priority": "high",
    "dueDate": "2024-12-31"
  }'
```

---

## 🚦 Status Codes

| Code | Meaning |
|------|---------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 500 | Internal Server Error |

---

## 📚 Dependencies Overview

| Package | Version | Purpose |
|---------|---------|---------|
| express | ^5.2.1 | Web framework |
| mongoose | ^9.2.4 | MongoDB ODM |
| jsonwebtoken | ^9.0.3 | JWT authentication |
| bcrypt | ^6.0.0 | Password hashing |
| zod | ^4.3.6 | Schema validation |
| dotenv | ^17.3.1 | Environment variables |
| typescript | ^5.9.3 | Type-safe development |
| tsc-watch | ^7.2.0 | TypeScript watch mode |

---

## 🤝 Contributing

1. Create a feature branch: `git checkout -b feature/your-feature`
2. Commit changes: `git commit -m 'Add your feature'`
3. Push to branch: `git push origin feature/your-feature`
4. Open a Pull Request

---

## 📄 License

ISC License © 2024 Tejas Kale

---

## 📧 Support

For issues, questions, or suggestions, please reach out to the development team.

---

## 🎯 Future Enhancements

- [ ] WebSocket support for real-time updates
- [ ] File upload functionality
- [ ] Advanced search and filtering
- [ ] Notification system
- [ ] Email notifications
- [ ] API rate limiting
- [ ] Request logging
- [ ] Data export functionality
- [ ] Audit logs
- [ ] Two-factor authentication

---

**Last Updated:** May 2024  
**Version:** 1.0.0
