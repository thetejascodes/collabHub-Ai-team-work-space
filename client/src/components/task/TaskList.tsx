import type { Task } from '../../types/api'
import { TaskCard } from './TaskCard'

export const TaskList = ({
  tasks,
  workspaceId,
  projectId,
}: {
  tasks: Task[]
  workspaceId: string
  projectId: string
}) => {
  return (
    <div className="grid two-up">
      {tasks.map((task) => (
        <TaskCard key={task._id} task={task} workspaceId={workspaceId} projectId={projectId} />
      ))}
    </div>
  )
}
