import type { Workspace } from '../../types/api'
import { WorkspaceCard } from './WorkspaceCard'

export const WorkspaceList = ({
  workspaces,
  currentUserId,
  onOpen,
}: {
  workspaces: Workspace[]
  currentUserId?: string
  onOpen: (workspace: Workspace) => void
}) => {
  return (
    <div className="grid two-up">
      {workspaces.map((workspace) => (
        <WorkspaceCard
          key={workspace._id}
          workspace={workspace}
          currentUserId={currentUserId}
          onOpen={() => onOpen(workspace)}
        />
      ))}
    </div>
  )
}
