import { useEffect, useState } from 'react'
import { projectRoute } from '../router'
import { useWorkspace } from '../context/WorkspaceContext'
import { projectService } from '../services/projectService'
import { taskService } from '../services/taskService'
import { workspaceService } from '../services/workspaceService'
import type { Project, Task, TaskPriority, TaskStatus, Workspace } from '../types/api'
import { Topbar } from '../components/layout/Topbar'
import { ProjectForm } from '../components/project/ProjectForm'
import { TaskFilters } from '../components/task/TaskFilters'
import { TaskForm } from '../components/task/TaskForm'
import { TaskList } from '../components/task/TaskList'
import { Button } from '../components/ui/Button'
import { Modal } from '../components/ui/Modal'
import { Spinner } from '../components/ui/Spinner'

export const ProjectPage = () => {
  const { workspaceId, projectId } = projectRoute.useParams()
  const { currentRole, setCurrentWorkspace } = useWorkspace()
  const [workspace, setWorkspace] = useState<Workspace | null>(null)
  const [project, setProject] = useState<Project | null>(null)
  const [tasks, setTasks] = useState<Task[]>([])
  const [status, setStatus] = useState<TaskStatus | 'all'>('all')
  const [priority, setPriority] = useState<TaskPriority | 'all'>('all')
  const [loading, setLoading] = useState(true)
  const [taskModalOpen, setTaskModalOpen] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const canManage = currentRole === 'owner' || currentRole === 'admin'

  const loadProject = async () => {
    setLoading(true)
    setError(null)

    try {
      const [workspaceResponse, projectResponse, taskResponse] = await Promise.all([
        workspaceService.getWorkspace(workspaceId),
        projectService.getProject(projectId),
        taskService.listTasks(workspaceId, {
          projectId,
          status,
          priority,
        }),
      ])

      setWorkspace(workspaceResponse)
      setCurrentWorkspace(workspaceResponse)
      setProject(projectResponse)
      setTasks(taskResponse.data)
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Unable to load project.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void loadProject()
  }, [priority, projectId, status, workspaceId])

  return (
    <div className="page-shell">
      <Topbar
        title={project?.name ?? 'Project'}
        description="Project pages stay focused on task execution, with light project editing and direct task drill-down."
        actions={canManage ? <Button onClick={() => setTaskModalOpen(true)}>Create task</Button> : null}
      />

      {loading ? <Spinner label="Loading project..." /> : null}
      {error ? <p className="error-banner">{error}</p> : null}

      {project ? (
        <>
          <section className="hero-panel compact-hero">
            <div className="hero-panel-content">
              <p className="eyebrow">Delivery lane</p>
              <h2>{tasks.length} visible tasks inside this project.</h2>
              <p>{project.description || 'This project could use a clearer description to give tasks stronger framing.'}</p>
            </div>
          </section>

          <div className="page-grid">
          <section className="card">
            <div className="section-head">
              <div>
                <p className="eyebrow">Project</p>
                <h3>Project details</h3>
              </div>
            </div>
            <ProjectForm
              initialValues={project}
              submitLabel={canManage ? 'Save project' : 'View project'}
              onSubmit={async (payload) => {
                if (!canManage) {
                  return
                }

                const updated = await projectService.updateProject(projectId, payload)
                setProject(updated)
              }}
            />
          </section>

          <section className="card card-span">
            <div className="section-head">
              <div>
                <p className="eyebrow">Tasks</p>
                <h3>Execution board</h3>
              </div>
            </div>
            <TaskFilters status={status} priority={priority} onStatusChange={setStatus} onPriorityChange={setPriority} />
            <TaskList tasks={tasks} workspaceId={workspaceId} projectId={projectId} />
          </section>

          {workspace ? (
            <section className="card">
              <div className="section-head">
                <div>
                  <p className="eyebrow">Context</p>
                  <h3>{workspace.name}</h3>
                </div>
              </div>
              <p>{workspace.description || 'This workspace is ready for more structure.'}</p>
            </section>
          ) : null}
          </div>
        </>
      ) : null}

      <Modal open={taskModalOpen} title="Create task" onClose={() => setTaskModalOpen(false)}>
        <TaskForm
          submitLabel="Create task"
          onSubmit={async (payload) => {
            await taskService.createTask(workspaceId, projectId, payload)
            setTaskModalOpen(false)
            await loadProject()
          }}
        />
      </Modal>
    </div>
  )
}
