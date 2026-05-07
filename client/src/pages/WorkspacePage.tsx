import { useEffect, useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { Topbar } from '../components/layout/Topbar'
import { WorkspaceList } from '../components/workspace/WorkspaceList'
import { WorkspaceForm } from '../components/workspace/WorkspaceForm'
import { Modal } from '../components/ui/Modal'
import { Button } from '../components/ui/Button'
import { Spinner } from '../components/ui/Spinner'
import { useAuth } from '../context/AuthContext'
import { useWorkspace } from '../context/WorkspaceContext'
import { workspaceService } from '../services/workspaceService'
import type { Workspace } from '../types/api'

export const WorkspacePage = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { setCurrentWorkspace } = useWorkspace()
  const [workspaces, setWorkspaces] = useState<Workspace[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [open, setOpen] = useState(false)

  const loadWorkspaces = async () => {
    setLoading(true)
    setError(null)

    try {
      const data = await workspaceService.listMyWorkspaces()
      setWorkspaces(data)
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Unable to load workspaces.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void loadWorkspaces()
  }, [])

  return (
    <div className="page-shell">
      <Topbar
        title="Your workspaces"
        description="Start by selecting the collaboration space, then drill into projects and task threads from there."
        actions={<Button onClick={() => setOpen(true)}>Create workspace</Button>}
      />

      <section className="hero-panel compact-hero">
        <div className="hero-panel-content">
          <p className="eyebrow">Access</p>
          <h2>Workspace switcher</h2>
          <p>Choose the space you belong to, then move into its projects, task detail, and admin controls from one shared shell.</p>
        </div>
      </section>

      {loading ? <Spinner label="Loading workspaces..." /> : null}
      {error ? <p className="error-banner">{error}</p> : null}
      {!loading ? (
        <WorkspaceList
          workspaces={workspaces}
          currentUserId={user?._id}
          onOpen={async (workspace) => {
            setCurrentWorkspace(workspace)
            await navigate({
              to: '/workspaces/$workspaceId',
              params: { workspaceId: workspace._id },
            })
          }}
        />
      ) : null}

      <Modal open={open} title="Create workspace" onClose={() => setOpen(false)}>
        <WorkspaceForm
          submitLabel="Create workspace"
          onSubmit={async (payload) => {
            await workspaceService.createWorkspace(payload)
            setOpen(false)
            await loadWorkspaces()
          }}
        />
      </Modal>
    </div>
  )
}
