import { useEffect, useState } from 'react'
import { workspaceDetailRoute } from '../router'
import { useWorkspace } from '../context/WorkspaceContext'
import { activityService } from '../services/activityService'
import { projectService } from '../services/projectService'
import { workspaceService } from '../services/workspaceService'
import type { Activity, Project, Workspace, WorkspaceRole } from '../types/api'
import { ActivityFeed } from '../components/activity/ActivityFeed'
import { Topbar } from '../components/layout/Topbar'
import { ProjectList } from '../components/project/ProjectList'
import { ProjectForm } from '../components/project/ProjectForm'
import { Button } from '../components/ui/Button'
import { Modal } from '../components/ui/Modal'
import { Spinner } from '../components/ui/Spinner'
import { InviteMemberForm } from '../components/workspace/InviteMemberForm'
import { MemberList } from '../components/workspace/MemberList'
import { WorkspaceForm } from '../components/workspace/WorkspaceForm'
import { Link } from '@tanstack/react-router'

export const WorkspaceDetailPage = () => {
  const { workspaceId } = workspaceDetailRoute.useParams()
  const { currentRole, setCurrentWorkspace } = useWorkspace()
  const [workspace, setWorkspace] = useState<Workspace | null>(null)
  const [projects, setProjects] = useState<Project[]>([])
  const [activities, setActivities] = useState<Activity[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [projectModalOpen, setProjectModalOpen] = useState(false)

  const canManage = currentRole === 'owner' || currentRole === 'admin'

  const loadWorkspace = async () => {
    setLoading(true)
    setError(null)

    try {
      const [workspaceResponse, projectResponse, activityResponse] = await Promise.all([
        workspaceService.getWorkspace(workspaceId),
        projectService.listProjects(workspaceId),
        activityService.listWorkspaceActivity(workspaceId),
      ])

      setWorkspace(workspaceResponse)
      setCurrentWorkspace(workspaceResponse)
      setProjects(projectResponse.data)
      setActivities(activityResponse)
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Unable to load workspace.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void loadWorkspace()
  }, [workspaceId])

  return (
    <div className="page-shell">
      <Topbar
        title={workspace?.name ?? 'Workspace'}
        description="This page mirrors the backend workspace surface: members, project collection, activity feed, and role-aware settings."
        actions={
          canManage && workspace ? (
            <Link to="/workspaces/$workspaceId/admin" params={{ workspaceId }}>
              <Button variant="secondary">Open admin dashboard</Button>
            </Link>
          ) : null
        }
      />

      {loading ? <Spinner label="Loading workspace..." /> : null}
      {error ? <p className="error-banner">{error}</p> : null}

      {workspace ? (
        <>
          <section className="hero-panel compact-hero">
            <div className="hero-panel-content">
              <p className="eyebrow">Workspace pulse</p>
              <h2>{workspace.members.length} collaborators and {projects.length} active projects.</h2>
              <p>{workspace.description || 'Add a sharper workspace description to anchor members around shared context.'}</p>
            </div>
          </section>

          <div className="page-grid">
            <section className="card">
              <div className="section-head">
                <div>
                  <p className="eyebrow">Settings</p>
                  <h3>Workspace profile</h3>
                </div>
              </div>
              <WorkspaceForm
                initialValues={workspace}
                submitLabel={canManage ? 'Save workspace' : 'View workspace'}
                onSubmit={async (payload) => {
                  if (!canManage) {
                    return
                  }
                  const updated = await workspaceService.updateWorkspace(workspaceId, payload)
                  setWorkspace(updated)
                  setCurrentWorkspace(updated)
                }}
              />
            </section>

            <section className="card">
              <div className="section-head">
                <div>
                  <p className="eyebrow">Members</p>
                  <h3>Access and roles</h3>
                </div>
              </div>
              {canManage ? (
                <InviteMemberForm
                  onInvite={async (userId) => {
                    await workspaceService.inviteMember(workspaceId, userId)
                    await loadWorkspace()
                  }}
                />
              ) : null}
              <MemberList
                members={workspace.members}
                currentUserRole={currentRole}
                onRoleChange={async (userId, role) => {
                  if (currentRole !== 'owner') {
                    return
                  }

                  await workspaceService.changeRole(workspaceId, userId, role as WorkspaceRole)
                  await loadWorkspace()
                }}
                onRemove={async (userId) => {
                  if (!canManage) {
                    return
                  }
                  await workspaceService.removeMember(workspaceId, userId)
                  await loadWorkspace()
                }}
              />
            </section>

            <section className="card card-span">
              <div className="section-head">
                <div>
                  <p className="eyebrow">Projects</p>
                  <h3>Delivery streams</h3>
                </div>
                {canManage ? <Button onClick={() => setProjectModalOpen(true)}>Create project</Button> : null}
              </div>
              <ProjectList projects={projects} workspaceId={workspaceId} />
            </section>

            <ActivityFeed activities={activities} />
          </div>
        </>
      ) : null}

      <Modal open={projectModalOpen} title="Create project" onClose={() => setProjectModalOpen(false)}>
        <ProjectForm
          submitLabel="Create project"
          onSubmit={async (payload) => {
            await projectService.createProject({ ...payload, workspaceId })
            setProjectModalOpen(false)
            await loadWorkspace()
          }}
        />
      </Modal>
    </div>
  )
}
