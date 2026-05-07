import type { TaskPriority, TaskStatus } from '../../types/api'
import { Select } from '../ui/Select'

export const TaskFilters = ({
  status,
  priority,
  onStatusChange,
  onPriorityChange,
}: {
  status: TaskStatus | 'all'
  priority: TaskPriority | 'all'
  onStatusChange: (value: TaskStatus | 'all') => void
  onPriorityChange: (value: TaskPriority | 'all') => void
}) => {
  return (
    <div className="filters-row">
      <Select value={status} onChange={(event) => onStatusChange(event.target.value as TaskStatus | 'all')}>
        <option value="all">All statuses</option>
        <option value="todo">Todo</option>
        <option value="in-progress">In progress</option>
        <option value="done">Done</option>
      </Select>
      <Select value={priority} onChange={(event) => onPriorityChange(event.target.value as TaskPriority | 'all')}>
        <option value="all">All priorities</option>
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
      </Select>
    </div>
  )
}
