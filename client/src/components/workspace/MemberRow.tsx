import { Button } from '../ui/Button'
import { Badge } from '../ui/Badge'
import { Select } from '../ui/Select'
import { getUserSummary, type WorkspaceMember, type WorkspaceRole } from '../../types/api'

export const MemberRow = ({
  member,
  canManage,
  onRoleChange,
  onRemove,
}: {
  member: WorkspaceMember
  canManage: boolean
  onRoleChange: (role: WorkspaceRole) => void
  onRemove: () => void
}) => {
  const user = getUserSummary(member.user)

  return (
    <div className="list-row">
      <div>
        <strong>{user?.name ?? 'Unknown member'}</strong>
        <p>{user?.email ?? 'No email available'}</p>
      </div>
      <div className="row-actions">
        {canManage ? (
          <Select value={member.role} onChange={(event) => onRoleChange(event.target.value as WorkspaceRole)}>
            <option value="owner">Owner</option>
            <option value="admin">Admin</option>
            <option value="member">Member</option>
          </Select>
        ) : (
          <Badge tone="neutral">{member.role}</Badge>
        )}
        {canManage ? (
          <Button variant="ghost" onClick={onRemove}>
            Remove
          </Button>
        ) : null}
      </div>
    </div>
  )
}
