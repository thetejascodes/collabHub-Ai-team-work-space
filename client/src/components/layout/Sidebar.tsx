import { Link, useRouterState } from '@tanstack/react-router'
import type { Workspace, WorkspaceRole } from '../../types/api'

export const Sidebar = ({
  currentWorkspace,
  currentRole,
  open,
  onClose,
}: {
  currentWorkspace: Workspace | null
  currentRole: WorkspaceRole | null
  open: boolean
  onClose: () => void
}) => {
  const pathname = useRouterState({ select: (state) => state.location.pathname })

  const navClass = (active: boolean) => `nav-link ${active ? 'active' : ''}`.trim()

  return (
    <aside className={`sidebar ${open ? 'open' : ''}`}>
      <div className="sidebar-head">
        <div>
          <p className="eyebrow">Navigation</p>
          <h3>Command rail</h3>
        </div>
        <button className="icon-btn mobile-only" onClick={onClose} aria-label="Close navigation">
          x
        </button>
      </div>

      <nav className="nav-group">
        <Link to="/workspaces" className={navClass(pathname === '/workspaces')} onClick={onClose}>
          All workspaces
        </Link>
        {currentWorkspace ? (
          <>
            <Link
              to="/workspaces/$workspaceId"
              params={{ workspaceId: currentWorkspace._id }}
              className={navClass(pathname === `/workspaces/${currentWorkspace._id}`)}
              onClick={onClose}
            >
              Workspace overview
            </Link>
            <Link to="/notifications" className={navClass(pathname === '/notifications')} onClick={onClose}>
              Notifications
            </Link>
            {currentRole === 'owner' || currentRole === 'admin' ? (
              <Link
                to="/workspaces/$workspaceId/admin"
                params={{ workspaceId: currentWorkspace._id }}
                className={navClass(pathname === `/workspaces/${currentWorkspace._id}/admin`)}
                onClick={onClose}
              >
                Admin dashboard
              </Link>
            ) : null}
          </>
        ) : null}
      </nav>

      <div className="sidebar-status">
        <span className="status-dot" />
        <span>{currentRole ? `${currentRole} controls enabled` : 'Workspace context inactive'}</span>
      </div>

      <div className="sidebar-panel">
        <p className="eyebrow">Focus</p>
        <h4>{currentWorkspace?.name ?? 'Choose a workspace'}</h4>
        <p>
          Keep the main navigation shallow: select workspace, open project, then drill into a task thread when details
          matter.
        </p>
      </div>
    </aside>
  )
}
