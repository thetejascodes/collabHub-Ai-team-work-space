import { request } from './apiClient'
import type { Comment, MetaPage } from '../types/api'

export const commentService = {
  listComments(taskId: string) {
    return request<{ success: boolean; data: MetaPage<Comment> }>(`/tasks/${taskId}/comments`)
  },
  createComment(
    taskId: string,
    payload: {
      content: string
      type?: 'text'
      mentions?: string[]
      parentCommentId?: string
      attachments?: Array<{ filename: string; url: string; mimeType?: string; size?: number }>
    },
  ) {
    return request<{ success: boolean; data: Comment }>(`/tasks/${taskId}/comments`, {
      method: 'POST',
      body: {
        type: 'text',
        mentions: [],
        ...payload,
      },
    })
  },
  updateComment(taskId: string, commentId: string, payload: { content: string }) {
    return request<{ success: boolean; data: Comment }>(`/tasks/${taskId}/comments/${commentId}`, {
      method: 'PATCH',
      body: payload,
    })
  },
  deleteComment(taskId: string, commentId: string) {
    return request<void>(`/tasks/${taskId}/comments/${commentId}`, {
      method: 'DELETE',
    })
  },
}
