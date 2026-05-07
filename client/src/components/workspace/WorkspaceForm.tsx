import { useEffect, useState } from 'react'
import { Button } from '../ui/Button'
import { FormField } from '../ui/FormField'
import { InputField } from '../auth/InputField'

export const WorkspaceForm = ({
  initialValues,
  onSubmit,
  submitLabel,
}: {
  initialValues?: { name?: string; description?: string }
  onSubmit: (payload: { name: string; description?: string }) => Promise<void>
  submitLabel: string
}) => {
  const [name, setName] = useState(initialValues?.name ?? '')
  const [description, setDescription] = useState(initialValues?.description ?? '')

  useEffect(() => {
    setName(initialValues?.name ?? '')
    setDescription(initialValues?.description ?? '')
  }, [initialValues?.description, initialValues?.name])

  return (
    <form
      className="stack-form"
      onSubmit={async (event) => {
        event.preventDefault()
        await onSubmit({ name, description })
      }}
    >
      <FormField label="Workspace name">
        <InputField value={name} onChange={(event) => setName(event.target.value)} placeholder="Product ops" />
      </FormField>
      <FormField label="Description">
        <textarea
          className="input textarea"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          placeholder="What work belongs here?"
        />
      </FormField>
      <Button type="submit">{submitLabel}</Button>
    </form>
  )
}
