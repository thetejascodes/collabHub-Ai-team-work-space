import { useEffect, useMemo, useState } from 'react'
import { Link } from '@tanstack/react-router'
import { adminDashboardRoute } from '../router'
import { Topbar } from '../components/layout/Topbar'
import { Spinner } from '../components/ui/Spinner'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { activityService } from '../services/activityService'
import { notificationService } from '../services/notificationService'
import { projectService } from '../services/projectService'
import { taskService } from '../services/taskService'
import { workspaceService } from '../services/workspaceService'
import { useAuth } from '../context/AuthContext'
import { useWorkspace } from '../context/WorkspaceContext'
import {
  formatDate,
  formatDateTime,
  getEntityId,
  type Activity,
  type Notification,
  type Project,
  type Task,
  type Workspace,
} from '../types/api'

const DashboardMetric = ({
  label,
  value,
  note,
  tone = 'neutral',
}: {
  label: string
  value: string | number
  note: string
  tone?: 'neutral' | 'accent' | 'success' | 'warning'
}) => (
  <article className={`metric-card metric-${tone}`}>
    <p className="metric-label">{label}</p>
    <strong className="metric-value">{value}</strong>
    <span className="metric-note">{note}</span>
  </article>
)

export const AdminDashboardPage = () => {
  const { workspaceId } = adminDashboardRoute.useParams()
  const { user } = useAuth()
  const { currentRole, setCurrentWorkspace } = useWorkspace()
  const [workspace, setWorkspace] = useState<Workspace | null>(null)
  const [projects, setProjects] = useState<Project[]>([])
  const [tasks, setTasks] = useState<Task[]>([])
  const [activities, setActivities] = useState<Activity[]>([])
  const [unreadActivities, setUnreadActivities] = useState<Activity[]>([])
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const effectiveRole =
    workspace?.members.find((member) => getEntityId(member.user) === user?._id)?.role ?? currentRole
  const canViewDashboard = effectiveRole === 'owner' || effectiveRole === 'admin'

  useEffect(() => {
    const loadDashboard = async () => {
      setLoading(true)
      setError(null)

      try {
        const [workspaceResponse, projectResponse, taskResponse, activityResponse, unreadResponse, notificationResponse] =
          await Promise.all([
            workspaceService.getWorkspace(workspaceId),
            projectService.listProjects(workspaceId),
            taskService.listTasks(workspaceId, { limit: 50 }),
            activityService.listWorkspaceActivity(workspaceId),
            activityService.listUnreadActivity(workspaceId),
            notificationService.listNotifications(),
          ])

        setWorkspace(workspaceResponse)
        setCurrentWorkspace(workspaceResponse)
        setProjects(projectResponse.data)
        setTasks(taskResponse.data)
        setActivities(activityResponse)
        setUnreadActivities(unreadResponse)
        setNotifications(notificationResponse.data.data.filter((item) => item.workspaceId === workspaceId))
      } catch (caught) {
        setError(caught instanceof Error ? caught.message : 'Unable to load admin dashboard.')
      } finally {
        setLoading(false)
      }
    }

    void loadDashboard()
  }, [setCurrentWorkspace, workspaceId])

  const stats = useMemo(() => {
    const todoCount = tasks.filter((task) => task.status === 'todo').length
    const inProgressCount = tasks.filter((task) => task.status === 'in-progress').length
    const doneCount = tasks.filter((task) => task.status === 'done').length
    const overdueCount = tasks.filter((task) => task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'done').length
    const completionRate = tasks.length ? Math.round((doneCount / tasks.length) * 100) : 0
    const unreadNotifications = notifications.filter((item) => !item.isRead).length
    const ownerCount = workspace?.members.filter((member) => member.role === 'owner').length ?? 0
    const adminCount = workspace?.members.filter((member) => member.role === 'admin').length ?? 0
    const memberCount = workspace?.members.filter((member) => member.role === 'member').length ?? 0

    return {
      todoCount,
      inProgressCount,
      doneCount,
      overdueCount,
      completionRate,
      unreadNotifications,
      ownerCount,
      adminCount,
      memberCount,
    }
  }, [notifications, tasks, workspace?.members])

  const projectInsights = useMemo(() => {
    return projects
      .map((project) => {
        const projectTasks = tasks.filter((task) => getEntityId(task.projectId) === project._id)
        const completedTasks = projectTasks.filter((task) => task.status === 'done').length
        const overdueTasks = projectTasks.filter(
          (task) => task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'done',
        ).length

        return {
          project,
          totalTasks: projectTasks.length,
          completedTasks,
          overdueTasks,
          progress: projectTasks.length ? Math.round((completedTasks / projectTasks.length) * 100) : 0,
        }
      })
      .sort((left, right) => right.totalTasks - left.totalTasks)
  }, [projects, tasks])

  const attentionTasks = useMemo(() => {
    return tasks
      .filter((task) => task.status !== 'done')
      .sort((left, right) => {
        const leftDue = left.dueDate ? new Date(left.dueDate).getTime() : Number.MAX_SAFE_INTEGER
        const rightDue = right.dueDate ? new Date(right.dueDate).getTime() : Number.MAX_SAFE_INTEGER
        return leftDue - rightDue
      })
      .slice(0, 5)
  }, [tasks])

  if (loading) {
    return (
      <div className="page-shell">
        <Spinner label="Loading admin dashboard..." />
      </div>
    )
  }

  if (!canViewDashboard) {
    return (
      <div className="page-shell">
        <Topbar
          title="Admin dashboard"
          description="This view is reserved for workspace owners and admins because it focuses on access, health, and operational oversight."
        />
        <section className="hero-panel">
          <div className="hero-panel-content">
            <p className="eyebrow">Restricted</p>
            <h2>You do not have admin access for this workspace.</h2>
            <p>Open the workspace overview or project pages instead.</p>
            <div className="hero-actions">
              <Link to="/workspaces/$workspaceId" params={{ workspaceId }}>
                <Button>Back to workspace</Button>
              </Link>
            </div>
          </div>
        </section>
      </div>
    )
  }

  return (
    <div className="page-shell">
      <Topbar
        title={`${workspace?.name ?? 'Workspace'} dashboard`}
        description="A control surface for owners and admins: member load, delivery pace, unread activity, and the tasks that need attention first."
      />

      {error ? <p className="error-banner">{error}</p> : null}

      <section className="hero-panel">
        <div className="hero-panel-content">
          <p className="eyebrow">Admin command center</p>
          <h2>Keep the whole workspace legible at a glance.</h2>
          <p>
            Track delivery flow, spot overdue work, and move between governance and execution without leaving the active
            workspace context.
          </p>
          <div className="hero-actions">
            <Link to="/workspaces/$workspaceId" params={{ workspaceId }}>
              <Button variant="secondary">Workspace overview</Button>
            </Link>
            <Link to="/notifications">
              <Button variant="ghost">Review notifications</Button>
            </Link>
          </div>
        </div>
        <div className="hero-panel-aside">
          <div className="signal-card">
            <span className="signal-label">Completion rate</span>
            <strong>{stats.completionRate}%</strong>
            <p>{stats.doneCount} of {tasks.length} tasks closed.</p>
          </div>
          <div className="signal-card">
            <span className="signal-label">Unread signals</span>
            <strong>{unreadActivities.length + stats.unreadNotifications}</strong>
            <p>{unreadActivities.length} activities and {stats.unreadNotifications} notifications need review.</p>
          </div>
        </div>
      </section>

      <div className="metrics-grid">
        <DashboardMetric label="Members" value={workspace?.members.length ?? 0} note="People with workspace access" tone="accent" />
        <DashboardMetric label="Projects" value={projects.length} note="Active delivery tracks" tone="neutral" />
        <DashboardMetric label="In progress" value={stats.inProgressCount} note="Tasks currently moving" tone="success" />
        <DashboardMetric label="Overdue" value={stats.overdueCount} note="Open tasks past due date" tone="warning" />
      </div>

      <div className="dashboard-grid">
        <section className="card spotlight-card">
          <div className="section-head">
            <div>
              <p className="eyebrow">Roles</p>
              <h3>Access distribution</h3>
            </div>
            <Badge tone="accent">{effectiveRole ?? 'member'}</Badge>
          </div>
          <div className="mini-stats">
            <div className="mini-stat">
              <span>Owners</span>
              <strong>{stats.ownerCount}</strong>
            </div>
            <div className="mini-stat">
              <span>Admins</span>
              <strong>{stats.adminCount}</strong>
            </div>
            <div className="mini-stat">
              <span>Members</span>
              <strong>{stats.memberCount}</strong>
            </div>
          </div>
          <p className="support-copy">
            Owner and admin roles map to the backend's member-management and settings actions, so this panel helps
            confirm governance shape before editing access.
          </p>
        </section>

        <section className="card spotlight-card">
          <div className="section-head">
            <div>
              <p className="eyebrow">Flow</p>
              <h3>Task mix</h3>
            </div>
          </div>
          <div className="mini-stats">
            <div className="mini-stat">
              <span>Todo</span>
              <strong>{stats.todoCount}</strong>
            </div>
            <div className="mini-stat">
              <span>In progress</span>
              <strong>{stats.inProgressCount}</strong>
            </div>
            <div className="mini-stat">
              <span>Done</span>
              <strong>{stats.doneCount}</strong>
            </div>
          </div>
          <p className="support-copy">
            A healthy workspace usually has a visible middle lane. Too much todo or overdue work suggests prioritization
            or staffing pressure.
          </p>
        </section>

        <section className="card card-span">
          <div className="section-head">
            <div>
              <p className="eyebrow">Projects</p>
              <h3>Project health snapshot</h3>
            </div>
          </div>
          <div className="stack-list">
            {projectInsights.map(({ project, totalTasks, completedTasks, overdueTasks, progress }) => (
              <article key={project._id} className="list-row dashboard-row">
                <div>
                  <strong>{project.name}</strong>
                  <p>{project.description || 'No project description yet.'}</p>
                </div>
                <div className="progress-meta">
                  <span>{completedTasks}/{totalTasks || 0} done</span>
                  <span>{overdueTasks} overdue</span>
                  <span>{progress}% complete</span>
                </div>
                <div className="progress-rail">
                  <div className="progress-fill" style={{ width: `${progress}%` }} />
                </div>
                <Link
                  to="/workspaces/$workspaceId/projects/$projectId"
                  params={{ workspaceId, projectId: project._id }}
                  className="text-link"
                >
                  Open project
                </Link>
              </article>
            ))}
          </div>
        </section>

        <section className="card">
          <div className="section-head">
            <div>
              <p className="eyebrow">Attention</p>
              <h3>Next tasks at risk</h3>
            </div>
          </div>
          <div className="stack-list">
            {attentionTasks.map((task) => (
              <article key={task._id} className="list-row dashboard-row">
                <div>
                  <strong>{task.title}</strong>
                  <p>Due {formatDate(task.dueDate)}</p>
                </div>
                <Badge tone={task.priority === 'high' ? 'warning' : task.status === 'in-progress' ? 'accent' : 'neutral'}>
                  {task.priority}
                </Badge>
              </article>
            ))}
          </div>
        </section>

        <section className="card">
          <div className="section-head">
            <div>
              <p className="eyebrow">Activity</p>
              <h3>Latest workspace signals</h3>
            </div>
          </div>
          <div className="stack-list">
            {activities.slice(0, 5).map((activity) => (
              <article key={activity._id} className="list-row dashboard-row">
                <div>
                  <strong>{activity.message}</strong>
                  <p>{formatDateTime(activity.createdAt)}</p>
                </div>
                <Badge tone={activity.isRead ? 'neutral' : 'accent'}>{activity.isRead ? 'Read' : 'New'}</Badge>
              </article>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
