import type { Project } from '../../types/api'
import { ProjectCard } from './ProjectCard'

export const ProjectList = ({
  projects,
  workspaceId,
}: {
  projects: Project[]
  workspaceId: string
}) => {
  return (
    <div className="grid two-up">
      {projects.map((project) => (
        <ProjectCard key={project._id} project={project} workspaceId={workspaceId} />
      ))}
    </div>
  )
}
