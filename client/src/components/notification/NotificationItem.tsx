import { formatDateTime, type Notification } from '../../types/api'
import { Button } from '../ui/Button'
import { Badge } from '../ui/Badge'

export const NotificationItem = ({
  notification,
  onMarkRead,
}: {
  notification: Notification
  onMarkRead: () => void
}) => {
  return (
    <article className="list-row">
      <div>
        <strong>{notification.message}</strong>
        <p>{formatDateTime(notification.createdAt)}</p>
      </div>
      <div className="row-actions">
        <Badge tone={notification.isRead ? 'neutral' : 'accent'}>{notification.isRead ? 'Read' : 'Unread'}</Badge>
        {!notification.isRead ? (
          <Button variant="ghost" onClick={onMarkRead}>
            Mark read
          </Button>
        ) : null}
      </div>
    </article>
  )
}
