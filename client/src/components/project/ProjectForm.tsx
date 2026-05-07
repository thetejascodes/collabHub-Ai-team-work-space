import { useEffect, useState } from 'react'
import { Button } from '../ui/Button'
import { FormField } from '../ui/FormField'
import { InputField } from '../auth/InputField'

export const ProjectForm = ({
  initialValues,
  submitLabel,
  onSubmit,
}: {
  initialValues?: { name?: string; description?: string }
  submitLabel: string
  onSubmit: (payload: { name: string; description?: string }) => Promise<void>
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
      <FormField label="Project name">
        <InputField value={name} onChange={(event) => setName(event.target.value)} placeholder="Release planning" />
      </FormField>
      <FormField label="Description">
        <textarea
          className="input textarea"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          placeholder="What outcome should this project drive?"
        />
      </FormField>
      <Button type="submit">{submitLabel}</Button>
    </form>
  )
}
