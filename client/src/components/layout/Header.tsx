import { Link } from '@tanstack/react-router'
import { NotificationBell } from '../notification/NotificationBell'
import { getInitials, type UserSummary, type Workspace, type WorkspaceRole } from '../../types/api'
import { Button } from '../ui/Button'

export const Header = ({
  currentUser,
  currentWorkspace,
  currentRole,
  unreadCount,
  onToggleSidebar,
  onLogout,
}: {
  currentUser: UserSummary | null
  currentWorkspace: Workspace | null
  currentRole: WorkspaceRole | null
  unreadCount: number
  onToggleSidebar: () => void
  onLogout: () => void
}) => {
  return (
    <header className="header">
      <div className="header-left">
        <button className="icon-btn mobile-only" onClick={onToggleSidebar} aria-label="Open navigation">
          =
        </button>
        <div>
          <p className="eyebrow">Workspace-first planning</p>
          <h2>{currentWorkspace?.name ?? 'CollabHub'}</h2>
          <p className="header-subtle">{currentRole ? `${currentRole} access` : 'Pick a workspace to continue'}</p>
        </div>
      </div>

      <div className="header-actions">
        <NotificationBell unreadCount={unreadCount} />
        {currentWorkspace && (currentRole === 'owner' || currentRole === 'admin') ? (
          <Link to="/workspaces/$workspaceId/admin" params={{ workspaceId: currentWorkspace._id }} className="link-chip">
            Dashboard
          </Link>
        ) : null}
        <Link to="/workspaces" className="link-chip">
          Workspaces
        </Link>
        <div className="user-pill">
          <span className="avatar">{getInitials(currentUser?.name ?? 'User')}</span>
          <div>
            <strong>{currentUser?.name ?? 'Guest'}</strong>
            <span>{currentUser?.email ?? 'No email'}</span>
          </div>
        </div>
        <Button variant="ghost" onClick={onLogout}>
          Logout
        </Button>
      </div>
    </header>
  )
}
