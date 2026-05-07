import type { WorkspaceMember, WorkspaceRole } from '../../types/api'
import { getEntityId } from '../../types/api'
import { MemberRow } from './MemberRow'

export const MemberList = ({
  members,
  currentUserRole,
  onRoleChange,
  onRemove,
}: {
  members: WorkspaceMember[]
  currentUserRole: WorkspaceRole | null
  onRoleChange: (userId: string, role: WorkspaceRole) => void
  onRemove: (userId: string) => void
}) => {
  const canManage = currentUserRole === 'owner' || currentUserRole === 'admin'

  return (
    <div className="stack-list">
      {members.map((member) => (
        <MemberRow
          key={`${getEntityId(member.user)}-${member.joinedAt}`}
          member={member}
          canManage={canManage}
          onRoleChange={(role) => onRoleChange(getEntityId(member.user), role)}
          onRemove={() => onRemove(getEntityId(member.user))}
        />
      ))}
    </div>
  )
}
