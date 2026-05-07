import {
  Outlet,
  createRootRouteWithContext,
  createRoute,
  createRouter,
  useNavigate,
} from '@tanstack/react-router'
import { useEffect } from 'react'
import { AppLayout } from './components/layout/AppLayout'
import { Spinner } from './components/ui/Spinner'
import { useAuth, type AuthContextValue } from './context/AuthContext'
import { useWorkspace, type WorkspaceContextValue } from './context/WorkspaceContext'
import { AuthPage } from './pages/AuthPage'
import { AdminDashboardPage } from './pages/AdminDashboardPage'
import { NotificationsPage } from './pages/NotificationsPage'
import { ProjectPage } from './pages/ProjectPage'
import { TaskDetailPage } from './pages/TaskDetailPage'
import { WorkspaceDetailPage } from './pages/WorkspaceDetailPage'
import { WorkspacePage } from './pages/WorkspacePage'

export interface RouterContext {
  auth: AuthContextValue
  workspace: WorkspaceContextValue
}

const rootRoute = createRootRouteWithContext<RouterContext>()({
  component: () => <Outlet />,
  notFoundComponent: () => (
    <div className="empty-state page-shell">
      <h2>Route not found</h2>
      <p>The page you tried to open does not exist in this workspace flow.</p>
    </div>
  ),
})

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: IndexRedirect,
})

const authRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/auth',
  component: AuthPage,
})

const protectedRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: 'app-shell',
  component: ProtectedLayout,
})

const workspacesRoute = createRoute({
  getParentRoute: () => protectedRoute,
  path: '/workspaces',
  component: WorkspacePage,
})

export const workspaceDetailRoute = createRoute({
  getParentRoute: () => protectedRoute,
  path: '/workspaces/$workspaceId',
  component: WorkspaceDetailPage,
})

export const projectRoute = createRoute({
  getParentRoute: () => protectedRoute,
  path: '/workspaces/$workspaceId/projects/$projectId',
  component: ProjectPage,
})

export const adminDashboardRoute = createRoute({
  getParentRoute: () => protectedRoute,
  path: '/workspaces/$workspaceId/admin',
  component: AdminDashboardPage,
})

export const taskDetailRoute = createRoute({
  getParentRoute: () => protectedRoute,
  path: '/workspaces/$workspaceId/projects/$projectId/tasks/$taskId',
  component: TaskDetailPage,
})

const notificationsRoute = createRoute({
  getParentRoute: () => protectedRoute,
  path: '/notifications',
  component: NotificationsPage,
})

const routeTree = rootRoute.addChildren([
  indexRoute,
  authRoute,
  protectedRoute.addChildren([
    workspacesRoute,
    workspaceDetailRoute,
    adminDashboardRoute,
    projectRoute,
    taskDetailRoute,
    notificationsRoute,
  ]),
])

export const router = createRouter({
  routeTree,
  context: {
    auth: undefined!,
    workspace: undefined!,
  },
  defaultPreload: 'intent',
})

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

function IndexRedirect() {
  const { isAuthenticated, isBootstrapping } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (isBootstrapping) {
      return
    }

    void navigate({
      to: isAuthenticated ? '/workspaces' : '/auth',
      replace: true,
    })
  }, [isAuthenticated, isBootstrapping, navigate])

  return (
    <div className="page-shell centered-shell">
      <Spinner label="Preparing CollabHub..." />
    </div>
  )
}

function ProtectedLayout() {
  const auth = useAuth()
  const workspace = useWorkspace()
  const navigate = useNavigate()

  useEffect(() => {
    if (!auth.isBootstrapping && !auth.isAuthenticated) {
      void navigate({ to: '/auth', replace: true })
    }
  }, [auth.isAuthenticated, auth.isBootstrapping, navigate])

  if (auth.isBootstrapping) {
    return (
      <div className="page-shell centered-shell">
        <Spinner label="Loading your workspace..." />
      </div>
    )
  }

  if (!auth.isAuthenticated) {
    return null
  }

  return (
    <AppLayout
      currentUser={auth.user}
      currentWorkspace={workspace.currentWorkspace}
      currentRole={workspace.currentRole}
    >
      <Outlet />
    </AppLayout>
  )
}
