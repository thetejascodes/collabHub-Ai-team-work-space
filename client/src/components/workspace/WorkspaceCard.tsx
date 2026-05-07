import { Button } from '../ui/Button'
import { Badge } from '../ui/Badge'
import { getEntityId, type Workspace } from '../../types/api'

export const WorkspaceCard = ({
  workspace,
  currentUserId,
  onOpen,
}: {
  workspace: Workspace
  currentUserId?: string
  onOpen: () => void
}) => {
  const role = workspace.members.find((member) => getEntityId(member.user) === currentUserId)?.role ?? 'member'

  return (
    <article className="card workspace-card">
      <div className="card-head">
        <div>
          <p className="eyebrow">Workspace</p>
          <h3>{workspace.name}</h3>
        </div>
        <Badge tone={role === 'owner' ? 'accent' : role === 'admin' ? 'success' : 'neutral'}>{role}</Badge>
      </div>
      <p>{workspace.description || 'No description yet. Add one to make the space easier to scan.'}</p>
      <div className="workspace-meta">
        <span>{workspace.members.length} members</span>
        <span>{workspace.isActive ? 'Active' : 'Inactive'}</span>
      </div>
      <Button onClick={onOpen}>Open workspace</Button>
    </article>
  )
}
