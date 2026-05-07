import { useEffect, useState } from 'react'
import { taskDetailRoute } from '../router'
import { commentService } from '../services/commentService'
import { taskService } from '../services/taskService'
import { useWorkspace } from '../context/WorkspaceContext'
import type { Comment, Task } from '../types/api'
import { CommentThread } from '../components/comment/CommentThread'
import { Topbar } from '../components/layout/Topbar'
import { TaskDetail } from '../components/task/TaskDetail'
import { TaskForm } from '../components/task/TaskForm'
import { Spinner } from '../components/ui/Spinner'

export const TaskDetailPage = () => {
  const { workspaceId, projectId, taskId } = taskDetailRoute.useParams()
  const { currentRole } = useWorkspace()
  const [task, setTask] = useState<Task | null>(null)
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const canEdit = currentRole === 'owner' || currentRole === 'admin' || currentRole === 'member'

  const loadTask = async () => {
    setLoading(true)
    setError(null)

    try {
      const [taskResponse, commentResponse] = await Promise.all([
        taskService.getTask(workspaceId, projectId, taskId),
        commentService.listComments(taskId),
      ])

      setTask(taskResponse)
      setComments(commentResponse.data.data)
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Unable to load task.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void loadTask()
  }, [projectId, taskId, workspaceId])

  return (
    <div className="page-shell">
      <Topbar
        title={task?.title ?? 'Task detail'}
        description="Task detail combines status updates, priority and assignee changes, due dates, and the full comment thread."
      />

      {loading ? <Spinner label="Loading task..." /> : null}
      {error ? <p className="error-banner">{error}</p> : null}

      {task ? (
        <>
          <section className="hero-panel compact-hero">
            <div className="hero-panel-content">
              <p className="eyebrow">Task thread</p>
              <h2>{task.status === 'done' ? 'Completed work, preserved context.' : 'One place for updates, assignment, and discussion.'}</h2>
              <p>{task.description || 'Add a richer task description so the discussion thread starts from shared context instead of memory.'}</p>
            </div>
          </section>

          <div className="page-grid">
          <TaskDetail task={task} />
          <section className="card">
            <div className="section-head">
              <div>
                <p className="eyebrow">Updates</p>
                <h3>Edit task</h3>
              </div>
            </div>
            <TaskForm
              initialValues={{
                title: task.title,
                description: task.description,
                status: task.status,
                priority: task.priority,
                dueDate: task.dueDate,
              }}
              submitLabel={canEdit ? 'Update task' : 'View task'}
              onSubmit={async (payload) => {
                if (!canEdit) {
                  return
                }

                const response = await taskService.updateTask(workspaceId, projectId, taskId, payload)
                setTask(response.task)
              }}
            />
          </section>
          <div className="card-span">
            <CommentThread
              comments={comments}
              onCreate={async (content) => {
                await commentService.createComment(taskId, { content })
                await loadTask()
              }}
              onDelete={async (commentId) => {
                await commentService.deleteComment(taskId, commentId)
                await loadTask()
              }}
            />
          </div>
          </div>
        </>
      ) : null}
    </div>
  )
}
