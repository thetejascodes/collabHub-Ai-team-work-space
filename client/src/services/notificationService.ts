import { request } from './apiClient'
import type { MetaPage, Notification } from '../types/api'

export const notificationService = {
  listNotifications() {
    return request<{ success: boolean; data: MetaPage<Notification> }>('/notifications')
  },
  markRead(notificationId: string) {
    return request<{ success: boolean; data: Notification }>(`/notifications/${notificationId}/read`, {
      method: 'PATCH',
    })
  },
}
