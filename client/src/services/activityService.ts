import { request } from './apiClient'
import type { Activity } from '../types/api'

export const activityService = {
  listWorkspaceActivity(workspaceId: string) {
    return request<Activity[]>(`/workspaces/${workspaceId}/activities`)
  },
  listUnreadActivity(workspaceId: string) {
    return request<Activity[]>(`/workspaces/${workspaceId}/activities/unread`)
  },
  markRead(activityId: string) {
    return request<{ message: string }>(`/workspaces/activities/${activityId}/read`, {
      method: 'PATCH',
    })
  },
}
