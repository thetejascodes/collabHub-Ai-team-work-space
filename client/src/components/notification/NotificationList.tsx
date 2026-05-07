import type { Notification } from '../../types/api'
import { NotificationItem } from './NotificationItem'

export const NotificationList = ({
  notifications,
  onMarkRead,
}: {
  notifications: Notification[]
  onMarkRead: (notificationId: string) => Promise<void>
}) => {
  return (
    <section className="card">
      <div className="section-head">
        <div>
          <p className="eyebrow">Inbox</p>
          <h3>Notifications</h3>
        </div>
      </div>
      <div className="stack-list">
        {notifications.map((notification) => (
          <NotificationItem
            key={notification._id}
            notification={notification}
            onMarkRead={() => void onMarkRead(notification._id)}
          />
        ))}
      </div>
    </section>
  )
}
