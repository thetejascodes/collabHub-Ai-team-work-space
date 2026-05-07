import { useState } from 'react'
import { Button } from '../ui/Button'

export const CommentForm = ({
  onSubmit,
}: {
  onSubmit: (content: string) => Promise<void>
}) => {
  const [content, setContent] = useState('')

  return (
    <form
      className="stack-form"
      onSubmit={async (event) => {
        event.preventDefault()
        await onSubmit(content)
        setContent('')
      }}
    >
      <textarea
        className="input textarea"
        value={content}
        onChange={(event) => setContent(event.target.value)}
        placeholder="Add context, decisions, or blockers..."
      />
      <Button type="submit">Post comment</Button>
    </form>
  )
}
