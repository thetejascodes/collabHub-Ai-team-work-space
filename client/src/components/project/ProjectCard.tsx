import { Link } from '@tanstack/react-router'
import type { Project } from '../../types/api'
import { Badge } from '../ui/Badge'

export const ProjectCard = ({
  project,
  workspaceId,
}: {
  project: Project
  workspaceId: string
}) => {
  return (
    <article className="card">
      <div className="card-head">
        <div>
          <p className="eyebrow">Project</p>
          <h3>{project.name}</h3>
        </div>
        <Badge tone="accent">Live</Badge>
      </div>
      <p>{project.description || 'No project description provided yet.'}</p>
      <Link
        to="/workspaces/$workspaceId/projects/$projectId"
        params={{ workspaceId, projectId: project._id }}
        className="text-link"
      >
        Open project
      </Link>
    </article>
  )
}
