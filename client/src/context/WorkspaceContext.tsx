import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { useAuth } from './AuthContext'
import { getEntityId, type Workspace, type WorkspaceRole } from '../types/api'

const WORKSPACE_KEY = 'collabhub.workspace'

export interface WorkspaceContextValue {
  currentWorkspaceId: string | null
  currentWorkspace: Workspace | null
  currentRole: WorkspaceRole | null
  setCurrentWorkspace: (workspace: Workspace | null) => void
  selectWorkspaceId: (workspaceId: string | null) => void
}

const WorkspaceContext = createContext<WorkspaceContextValue | null>(null)

export const WorkspaceProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth()
  const [currentWorkspaceId, setCurrentWorkspaceId] = useState<string | null>(
    localStorage.getItem(WORKSPACE_KEY),
  )
  const [currentWorkspace, setWorkspace] = useState<Workspace | null>(null)

  useEffect(() => {
    if (!currentWorkspaceId) {
      localStorage.removeItem(WORKSPACE_KEY)
      return
    }

    localStorage.setItem(WORKSPACE_KEY, currentWorkspaceId)
  }, [currentWorkspaceId])

  useEffect(() => {
    if (!user) {
      setCurrentWorkspaceId(null)
      setWorkspace(null)
    }
  }, [user])

  const currentRole =
    currentWorkspace?.members.find((member) => getEntityId(member.user) === user?._id)?.role ?? null

  const value = useMemo<WorkspaceContextValue>(
    () => ({
      currentWorkspaceId,
      currentWorkspace,
      currentRole,
      setCurrentWorkspace(workspace) {
        setWorkspace(workspace)
        setCurrentWorkspaceId(workspace?._id ?? null)
      },
      selectWorkspaceId(workspaceId) {
        setCurrentWorkspaceId(workspaceId)
      },
    }),
    [currentRole, currentWorkspace, currentWorkspaceId],
  )

  return <WorkspaceContext.Provider value={value}>{children}</WorkspaceContext.Provider>
}

export const useWorkspace = () => {
  const context = useContext(WorkspaceContext)

  if (!context) {
    throw new Error('useWorkspace must be used inside WorkspaceProvider.')
  }

  return context
}
