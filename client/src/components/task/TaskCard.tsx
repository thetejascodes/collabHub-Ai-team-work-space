import { Link } from '@tanstack/react-router'
import { Badge } from '../ui/Badge'
import { formatDate, getUserLabel, type Task } from '../../types/api'

export const TaskCard = ({
  task,
  workspaceId,
  projectId,
}: {
  task: Task
  workspaceId: string
  projectId: string
}) => {
  return (
    <article className="card">
      <div className="card-head">
        <div>
          <p className="eyebrow">Task</p>
          <h3>{task.title}</h3>
        </div>
        <Badge tone={task.status === 'done' ? 'success' : task.priority === 'high' ? 'warning' : 'neutral'}>
          {task.status}
        </Badge>
      </div>
      <p>{task.description || 'No task description yet.'}</p>
      <div className="detail-line">
        <span>Priority: {task.priority}</span>
        <span>Assignee: {getUserLabel(task.assignedTo)}</span>
        <span>Due: {formatDate(task.dueDate)}</span>
      </div>
      <Link
        to="/workspaces/$workspaceId/projects/$projectId/tasks/$taskId"
        params={{ workspaceId, projectId, taskId: task._id }}
        className="text-link"
      >
        Open task thread
      </Link>
    </article>
  )
}
