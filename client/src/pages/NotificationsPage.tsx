import { useEffect, useState } from 'react'
import { NotificationList } from '../components/notification/NotificationList'
import { Topbar } from '../components/layout/Topbar'
import { Spinner } from '../components/ui/Spinner'
import { notificationService } from '../services/notificationService'
import type { Notification } from '../types/api'
import { Badge } from '../components/ui/Badge'

export const NotificationsPage = () => {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadNotifications = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await notificationService.listNotifications()
      setNotifications(response.data.data)
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Unable to load notifications.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void loadNotifications()
  }, [])

  return (
    <div className="page-shell">
      <Topbar
        title="Notifications"
        description="A dedicated inbox keeps read-state, follow-up actions, and cross-workspace activity visible even when the header bell is minimal."
        actions={<Badge tone="accent">{notifications.filter((item) => !item.isRead).length} unread</Badge>}
      />

      {loading ? <Spinner label="Loading notifications..." /> : null}
      {error ? <p className="error-banner">{error}</p> : null}

      {!loading ? (
        <>
          <section className="hero-panel compact-hero">
            <div className="hero-panel-content">
              <p className="eyebrow">Inbox</p>
              <h2>Keep action items from disappearing into the stream.</h2>
              <p>Use this page as the calmer, fuller version of the header bell when you want to triage what changed.</p>
            </div>
          </section>
          <NotificationList
            notifications={notifications}
            onMarkRead={async (notificationId) => {
              await notificationService.markRead(notificationId)
              await loadNotifications()
            }}
          />
        </>
      ) : null}
    </div>
  )
}
