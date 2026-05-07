import { request } from './apiClient'
import type { CursorPage, Project } from '../types/api'

export const projectService = {
  listProjects(workspaceId: string) {
    return request<{ success: boolean; message: string } & CursorPage<Project>>(
      `/project/workspace/${workspaceId}/projects`,
    )
  },
  getProject(projectId: string) {
    return request<Project>(`/project/projects/${projectId}`)
  },
  createProject(payload: { name: string; description?: string; workspaceId: string }) {
    return request<Project>('/project/projects', {
      method: 'POST',
      body: payload,
    })
  },
  updateProject(projectId: string, payload: { name?: string; description?: string; leadId?: string }) {
    return request<Project>(`/project/projects/${projectId}`, {
      method: 'PATCH',
      body: payload,
    })
  },
  deleteProject(projectId: string) {
    return request<void>(`/project/projects/${projectId}`, {
      method: 'DELETE',
    })
  },
}
