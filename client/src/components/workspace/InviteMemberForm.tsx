import { useState } from 'react'
import { Button } from '../ui/Button'
import { FormField } from '../ui/FormField'
import { InputField } from '../auth/InputField'

export const InviteMemberForm = ({
  onInvite,
}: {
  onInvite: (userId: string) => Promise<void>
}) => {
  const [userId, setUserId] = useState('')

  return (
    <form
      className="inline-form"
      onSubmit={async (event) => {
        event.preventDefault()
        await onInvite(userId)
        setUserId('')
      }}
    >
      <FormField label="Invite by user ID" hint="The backend invite route currently expects a raw user id.">
        <InputField value={userId} onChange={(event) => setUserId(event.target.value)} placeholder="664..." />
      </FormField>
      <Button type="submit">Invite member</Button>
    </form>
  )
}
