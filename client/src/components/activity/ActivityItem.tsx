import { formatDateTime, getUserLabel, type Activity } from '../../types/api'

export const ActivityItem = ({ activity }: { activity: Activity }) => {
  return (
    <article className="list-row">
      <div>
        <strong>{activity.message}</strong>
        <p>{getUserLabel(activity.userId)}</p>
      </div>
      <span>{formatDateTime(activity.createdAt)}</span>
    </article>
  )
}
