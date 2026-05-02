# 🤖 CollabHub AI Team Workspace

<div align="center">
  <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express.js" />
  <img src="https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB" />
  <img src="https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=JSON%20web%20tokens&logoColor=white" alt="JWT" />
</div>

<div align="center">
  <h3>🚀 A Powerful Backend API for AI-Powered Team Collaboration</h3>
  <p>Streamline your AI team's workflow with real-time activity tracking, intelligent notifications, and seamless project management.</p>
</div>

---

## ✨ Features

### 🔐 Authentication & Authorization
- **Secure JWT-based authentication** with bcrypt password hashing
- **Role-based access control** for workspaces and projects
- **Workspace membership validation** middleware

### 📊 Activity Management
- **Real-time activity logging** for all user actions
- **Unread activity tracking** with read status management
- **Workspace-specific activity feeds**

### 💬 Comments & Discussions
- **Threaded commenting system** on projects and tasks
- **Rich comment interactions** with create, read, delete operations
- **Context-aware comment routing**

### 🔔 Intelligent Notifications
- **Smart notification system** for team updates
- **Event-driven notifications** using custom event bus
- **Personalized notification preferences**

### 📁 Project & Task Management
- **Hierarchical project structure** with nested tasks
- **Comprehensive validation** using Zod schemas
- **Workspace-scoped project organization**

### 🏢 Workspace Management
- **Multi-workspace support** for different teams
- **Access control** at workspace level
- **Collaborative environment** setup

---

## 🛠️ Tech Stack

- **Backend**: Node.js, Express.js, TypeScript
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT with bcrypt
- **Validation**: Zod schema validation
- **Development**: tsc-watch for hot reloading

---

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/thetejascodes/collabHub-Ai-team-work-space.git
   cd collabHub-Ai-team-work-space
   ```

2. **Install dependencies**
   ```bash
   cd server
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the `server` directory:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/collabhub
   JWT_SECRET=your_super_secret_jwt_key
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

The API will be running at `http://localhost:5000`

---

## 📡 API Endpoints

### Authentication
- `POST /auth/register` - User registration
- `POST /auth/login` - User login

### Workspaces
- `GET /workspaces` - Get user's workspaces
- `POST /workspaces` - Create new workspace
- `GET /workspaces/:id` - Get workspace details

### Projects
- `GET /workspaces/:workspaceId/projects` - Get workspace projects
- `POST /workspaces/:workspaceId/projects` - Create project
- `PUT /projects/:id` - Update project
- `DELETE /projects/:id` - Delete project

### Tasks
- `GET /projects/:projectId/tasks` - Get project tasks
- `POST /projects/:projectId/tasks` - Create task
- `PATCH /tasks/:id` - Update task
- `DELETE /tasks/:id` - Delete task

### Activities
- `GET /:workspaceId/activities` - Get workspace activities
- `GET /:workspaceId/activities/unread` - Get unread activities
- `PATCH /activities/:activityId/read` - Mark activity as read

### Comments
- `GET /projects/:projectId/comments` - Get project comments
- `POST /projects/:projectId/comments` - Create comment
- `DELETE /comments/:id` - Delete comment

### Notifications
- `GET /notifications` - Get user notifications
- `PATCH /notifications/:id/read` - Mark notification as read

---

## 🏗️ Project Structure

```
collabHub-Ai-team-work-space/
├── server/
│   ├── src/
│   │   ├── controllers/     # Request handlers
│   │   ├── middleware/      # Custom middleware
│   │   ├── models/         # MongoDB schemas
│   │   ├── routes/         # API routes
│   │   ├── services/       # Business logic
│   │   ├── types/          # TypeScript types
│   │   ├── utils/          # Utility functions
│   │   ├── validators/     # Input validation
│   │   ├── app.ts          # Express app setup
│   │   └── server.ts       # Server entry point
│   ├── package.json
│   ├── tsconfig.json
│   └── .env
├── client/                 # Frontend (coming soon)
└── README.md
```

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Write comprehensive tests
- Update documentation for API changes
- Use conventional commit messages

---

## 📄 License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Tejas Kale**
- GitHub: [@thetejascodes](https://github.com/thetejascodes)

---

<div align="center">
  <p>Made with ❤️ for AI teams worldwide</p>
  <p>
    <a href="#-collabhub-ai-team-workspace">Back to top</a>
  </p>
</div>