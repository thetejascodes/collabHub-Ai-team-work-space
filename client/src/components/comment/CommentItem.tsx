import { formatDateTime, getUserLabel, type Comment } from '../../types/api'
import { Button } from '../ui/Button'

export const CommentItem = ({
  comment,
  onDelete,
}: {
  comment: Comment
  onDelete?: (commentId: string) => void
}) => {
  return (
    <article className="comment-card">
      <div className="comment-head">
        <strong>{getUserLabel(comment.userId)}</strong>
        <span>{formatDateTime(comment.createdAt)}</span>
      </div>
      <p>{comment.content}</p>
      {comment.replies?.length ? (
        <div className="reply-stack">
          {comment.replies.map((reply) => (
            <div key={reply._id} className="reply-chip">
              <strong>{getUserLabel(reply.userId)}</strong>
              <span>{reply.content}</span>
            </div>
          ))}
        </div>
      ) : null}
      {onDelete ? (
        <div className="row-actions">
          <Button variant="ghost" onClick={() => onDelete(comment._id)}>
            Delete
          </Button>
        </div>
      ) : null}
    </article>
  )
}
