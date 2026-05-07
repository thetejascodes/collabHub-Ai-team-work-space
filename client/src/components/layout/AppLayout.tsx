import { useEffect, useState, type ReactNode } from 'react'
import { useAuth } from '../../context/AuthContext'
import { notificationService } from '../../services/notificationService'
import type { UserSummary, Workspace, WorkspaceRole } from '../../types/api'
import { Header } from './Header'
import { Sidebar } from './Sidebar'

export const AppLayout = ({
  currentUser,
  currentWorkspace,
  currentRole,
  children,
}: {
  currentUser: UserSummary | null
  currentWorkspace: Workspace | null
  currentRole: WorkspaceRole | null
  children: ReactNode
}) => {
  const { logout } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    const syncNotifications = async () => {
      try {
        const response = await notificationService.listNotifications()
        const unread = response.data.data.filter((item) => !item.isRead).length
        setUnreadCount(unread)
      } catch {
        setUnreadCount(0)
      }
    }

    void syncNotifications()
  }, [])

  return (
    <div className="app-shell">
      <Sidebar
        currentWorkspace={currentWorkspace}
        currentRole={currentRole}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      <div className="shell-column">
        <Header
          currentUser={currentUser}
          currentWorkspace={currentWorkspace}
          currentRole={currentRole}
          unreadCount={unreadCount}
          onToggleSidebar={() => setSidebarOpen((value) => !value)}
          onLogout={logout}
        />
        <main className="content">{children}</main>
      </div>
      {sidebarOpen ? (
        <button className="mobile-scrim" aria-label="Close navigation" onClick={() => setSidebarOpen(false)} />
      ) : null}
    </div>
  )
}
