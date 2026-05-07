import { request } from './apiClient'
import type { CursorPage, Task, TaskPriority, TaskStatus } from '../types/api'

interface TaskFilters {
  projectId?: string
  status?: TaskStatus | 'all'
  priority?: TaskPriority | 'all'
  limit?: number
}

const toQueryString = (filters: TaskFilters) => {
  const query = new URLSearchParams()

  if (filters.projectId) {
    query.set('projectId', filters.projectId)
  }

  if (filters.status && filters.status !== 'all') {
    query.set('status', filters.status)
  }

  if (filters.priority && filters.priority !== 'all') {
    query.set('priority', filters.priority)
  }

  if (filters.limit) {
    query.set('limit', String(filters.limit))
  }

  const value = query.toString()
  return value ? `?${value}` : ''
}

export const taskService = {
  listTasks(workspaceId: string, filters: TaskFilters = {}) {
    return request<{ success: boolean; message: string } & CursorPage<Task>>(
      `/task/workspace/${workspaceId}/tasks${toQueryString(filters)}`,
    )
  },
  getTask(workspaceId: string, projectId: string, taskId: string) {
    return request<Task>(`/task/workspace/${workspaceId}/project/${projectId}/tasks/${taskId}`)
  },
  createTask(
    workspaceId: string,
    projectId: string,
    payload: {
      title: string
      description?: string
      status?: TaskStatus
      priority?: TaskPriority
      dueDate?: string
      assignedTo?: string
    },
  ) {
    return request<Task>(`/task/workspace/${workspaceId}/project/${projectId}/tasks`, {
      method: 'POST',
      body: payload,
    })
  },
  updateTask(
    workspaceId: string,
    projectId: string,
    taskId: string,
    payload: {
      title?: string
      description?: string
      status?: TaskStatus
      priority?: TaskPriority
      dueDate?: string
      assignedTo?: string
    },
  ) {
    return request<{ success: boolean; message: string; task: Task }>(
      `/task/workspace/${workspaceId}/project/${projectId}/tasks/${taskId}`,
      {
        method: 'PATCH',
        body: payload,
      },
    )
  },
  deleteTask(workspaceId: string, projectId: string, taskId: string) {
    return request<{ success: boolean; message: string }>(
      `/task/workspace/${workspaceId}/project/${projectId}/tasks/${taskId}`,
      {
        method: 'DELETE',
      },
    )
  },
}
