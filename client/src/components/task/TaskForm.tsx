import { useEffect, useState } from 'react'
import type { TaskPriority, TaskStatus } from '../../types/api'
import { InputField } from '../auth/InputField'
import { Button } from '../ui/Button'
import { FormField } from '../ui/FormField'
import { Select } from '../ui/Select'

export const TaskForm = ({
  initialValues,
  submitLabel,
  onSubmit,
}: {
  initialValues?: {
    title?: string
    description?: string
    status?: TaskStatus
    priority?: TaskPriority
    dueDate?: string
    assignedTo?: string
  }
  submitLabel: string
  onSubmit: (payload: {
    title: string
    description?: string
    status: TaskStatus
    priority: TaskPriority
    dueDate?: string
    assignedTo?: string
  }) => Promise<void>
}) => {
  const [title, setTitle] = useState(initialValues?.title ?? '')
  const [description, setDescription] = useState(initialValues?.description ?? '')
  const [status, setStatus] = useState<TaskStatus>(initialValues?.status ?? 'todo')
  const [priority, setPriority] = useState<TaskPriority>(initialValues?.priority ?? 'medium')
  const [dueDate, setDueDate] = useState(initialValues?.dueDate?.slice(0, 10) ?? '')
  const [assignedTo, setAssignedTo] = useState(initialValues?.assignedTo ?? '')

  useEffect(() => {
    setTitle(initialValues?.title ?? '')
    setDescription(initialValues?.description ?? '')
    setStatus(initialValues?.status ?? 'todo')
    setPriority(initialValues?.priority ?? 'medium')
    setDueDate(initialValues?.dueDate?.slice(0, 10) ?? '')
    setAssignedTo(initialValues?.assignedTo ?? '')
  }, [
    initialValues?.assignedTo,
    initialValues?.description,
    initialValues?.dueDate,
    initialValues?.priority,
    initialValues?.status,
    initialValues?.title,
  ])

  return (
    <form
      className="stack-form"
      onSubmit={async (event) => {
        event.preventDefault()
        await onSubmit({
          title,
          description,
          status,
          priority,
          dueDate: dueDate || undefined,
          assignedTo: assignedTo || undefined,
        })
      }}
    >
      <FormField label="Title">
        <InputField value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Prepare release notes" />
      </FormField>
      <FormField label="Description">
        <textarea
          className="input textarea"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          placeholder="What should happen in this task?"
        />
      </FormField>
      <div className="split-fields">
        <FormField label="Status">
          <Select value={status} onChange={(event) => setStatus(event.target.value as TaskStatus)}>
            <option value="todo">Todo</option>
            <option value="in-progress">In progress</option>
            <option value="done">Done</option>
          </Select>
        </FormField>
        <FormField label="Priority">
          <Select value={priority} onChange={(event) => setPriority(event.target.value as TaskPriority)}>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </Select>
        </FormField>
      </div>
      <div className="split-fields">
        <FormField label="Due date">
          <InputField type="date" value={dueDate} onChange={(event) => setDueDate(event.target.value)} />
        </FormField>
        <FormField label="Assigned user ID">
          <InputField value={assignedTo} onChange={(event) => setAssignedTo(event.target.value)} placeholder="664..." />
        </FormField>
      </div>
      <Button type="submit">{submitLabel}</Button>
    </form>
  )
}
