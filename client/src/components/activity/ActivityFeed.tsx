import type { Activity } from '../../types/api'
import { ActivityItem } from './ActivityItem'

export const ActivityFeed = ({ activities }: { activities: Activity[] }) => {
  return (
    <section className="card">
      <div className="section-head">
        <div>
          <p className="eyebrow">Activity</p>
          <h3>Recent movement</h3>
        </div>
      </div>
      <div className="stack-list">
        {activities.map((activity) => (
          <ActivityItem key={activity._id} activity={activity} />
        ))}
      </div>
    </section>
  )
}
