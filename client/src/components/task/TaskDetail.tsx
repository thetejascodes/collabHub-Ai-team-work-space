import type { Task } from '../../types/api'
import { Badge } from '../ui/Badge'
import { formatDate, formatDateTime, getUserLabel } from '../../types/api'

export const TaskDetail = ({ task }: { task: Task }) => {
  return (
    <section className="card detail-card">
      <div className="card-head">
        <div>
          <p className="eyebrow">Task detail</p>
          <h2>{task.title}</h2>
        </div>
        <Badge tone={task.status === 'done' ? 'success' : task.priority === 'high' ? 'warning' : 'accent'}>
          {task.status}
        </Badge>
      </div>
      <p>{task.description || 'No description for this task yet.'}</p>
      <div className="detail-grid">
        <div>
          <span className="detail-label">Priority</span>
          <strong>{task.priority}</strong>
        </div>
        <div>
          <span className="detail-label">Assigned to</span>
          <strong>{getUserLabel(task.assignedTo)}</strong>
        </div>
        <div>
          <span className="detail-label">Due date</span>
          <strong>{formatDate(task.dueDate)}</strong>
        </div>
        <div>
          <span className="detail-label">Last updated</span>
          <strong>{formatDateTime(task.updatedAt)}</strong>
        </div>
      </div>
    </section>
  )
}
