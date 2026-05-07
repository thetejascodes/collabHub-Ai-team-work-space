import type { Comment } from '../../types/api'
import { CommentForm } from './CommentForm'
import { CommentItem } from './CommentItem'

export const CommentThread = ({
  comments,
  onCreate,
  onDelete,
}: {
  comments: Comment[]
  onCreate: (content: string) => Promise<void>
  onDelete: (commentId: string) => Promise<void>
}) => {
  return (
    <section className="card">
      <div className="section-head">
        <div>
          <p className="eyebrow">Comments</p>
          <h3>Task discussion</h3>
        </div>
      </div>
      <CommentForm onSubmit={onCreate} />
      <div className="stack-list">
        {comments.map((comment) => (
          <CommentItem key={comment._id} comment={comment} onDelete={(commentId) => void onDelete(commentId)} />
        ))}
      </div>
    </section>
  )
}
