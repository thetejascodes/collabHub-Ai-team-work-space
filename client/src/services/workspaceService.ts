import { request } from './apiClient'
import type { Workspace, WorkspaceRole } from '../types/api'

export const workspaceService = {
  listMyWorkspaces() {
    return request<Workspace[]>('/workspace/workspaces/my')
  },
  getWorkspace(workspaceId: string) {
    return request<Workspace>(`/workspace/workspaces/${workspaceId}`)
  },
  createWorkspace(payload: { name: string; description?: string }) {
    return request<Workspace>('/workspace/workspaces', {
      method: 'POST',
      body: payload,
    })
  },
  updateWorkspace(workspaceId: string, payload: { name?: string; description?: string }) {
    return request<Workspace>(`/workspace/workspaces/${workspaceId}`, {
      method: 'PATCH',
      body: payload,
    })
  },
  inviteMember(workspaceId: string, userId: string) {
    return request<{ message: string; workspace: Workspace }>(
      `/workspace/workspaces/${workspaceId}/invite`,
      {
        method: 'POST',
        body: { userId },
      },
    )
  },
  removeMember(workspaceId: string, memberId: string) {
    return request<void>(`/workspace/${workspaceId}/member/${memberId}`, {
      method: 'DELETE',
    })
  },
  changeRole(workspaceId: string, userId: string, role: WorkspaceRole) {
    return request<{ message: string; data: unknown }>(`/workspace/${workspaceId}/member-role`, {
      method: 'PATCH',
      body: { userId, role },
    })
  },
  leave(workspaceId: string) {
    return request<Workspace>(`/workspace/${workspaceId}/leave`, {
      method: 'POST',
    })
  },
  delete(workspaceId: string) {
    return request<void>(`/workspace/${workspaceId}/delete`, {
      method: 'DELETE',
    })
  },
}
