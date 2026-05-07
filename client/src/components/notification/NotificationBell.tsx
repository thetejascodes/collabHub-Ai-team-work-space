import { Link } from '@tanstack/react-router'

export const NotificationBell = ({ unreadCount }: { unreadCount: number }) => {
  return (
    <Link to="/notifications" className="notif-bell" aria-label="Open notifications">
      <span>Notifications</span>
      {unreadCount > 0 ? <span className="notif-count">{unreadCount}</span> : null}
    </Link>
  )
}
