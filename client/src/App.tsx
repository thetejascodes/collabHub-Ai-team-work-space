import { RouterProvider } from '@tanstack/react-router'
import { AuthProvider, useAuth } from './context/AuthContext'
import { WorkspaceProvider, useWorkspace } from './context/WorkspaceContext'
import { router } from './router'

const AppRouter = () => {
  const auth = useAuth()
  const workspace = useWorkspace()

  return <RouterProvider router={router} context={{ auth, workspace }} />
}

const App = () => {
  return (
    <AuthProvider>
      <WorkspaceProvider>
        <AppRouter />
      </WorkspaceProvider>
    </AuthProvider>
  )
}

export default App
