export type Id = string

export type WorkspaceRole = 'owner' | 'admin' | 'member'
export type TaskStatus = 'todo' | 'in-progress' | 'done'
export type TaskPriority = 'low' | 'medium' | 'high'
export type CommentType = 'text' | 'file' | 'mention'

export interface UserSummary {
  _id: Id
  name: string
  email: string
  role?: string
  isVerified?: boolean
}

export interface WorkspaceMember {
  user: UserSummary | Id
  role: WorkspaceRole
  joinedAt: string
}

export interface Workspace {
  _id: Id
  name: string
  description?: string
  owner: UserSummary | Id
  members: WorkspaceMember[]
  isActive: boolean
  settings?: Record<string, unknown>
  createdAt: string
  updatedAt: string
}

export interface ProjectRef {
  _id?: Id
  name?: string
}

export interface Project {
  _id: Id
  name: string
  description?: string
  workspaceId: ProjectRef | Id
  leadId?: UserSummary | Id | null
  settings?: Record<string, unknown>
  createdAt: string
  updatedAt: string
}

export interface Task {
  _id: Id
  title: string
  description?: string
  status: TaskStatus
  priority: TaskPriority
  assignedTo?: UserSummary | Id | null
  createdBy: UserSummary | Id
  dueDate?: string
  completedAt?: string
  workspaceId: Id
  projectId: ProjectRef | Id
  createdAt: string
  updatedAt: string
}

export interface CommentAttachment {
  filename: string
  url: string
  mimeType?: string
  size?: number
}

export interface Comment {
  _id: Id
  taskId: Id
  workspaceId: Id
  userId: UserSummary | Id
  parentCommentId?: Id
  type: CommentType
  content: string
  mentions: Array<UserSummary | Id>
  attachments?: CommentAttachment[]
  replies?: Comment[]
  createdAt: string
  updatedAt: string
}

export interface Activity {
  _id: Id
  workspaceId: Id
  userId: UserSummary | Id
  actionType: string
  entityType: string
  entityId: Id
  message: string
  details?: Record<string, unknown>
  isRead?: boolean
  createdAt: string
  updatedAt: string
}

export interface Notification {
  _id: Id
  userId: Id
  workspaceId: Id
  actionType: string
  entityType: string
  entityId: Id
  message: string
  isRead: boolean
  metadata?: Record<string, unknown>
  createdAt: string
  updatedAt: string
}

export interface CursorPage<T> {
  data: T[]
  nextCursor: { createdAt: string; _id: Id } | null
  hasNextPage: boolean
  limit: number
}

export interface MetaPage<T> {
  meta: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
  data: T[]
}

export interface AuthResponse {
  accessToken: string
  user: UserSummary
  message?: string
}

export interface ApiErrorShape {
  message?: string
  error?: string
  success?: boolean
}

export const isUserSummary = (value: unknown): value is UserSummary => {
  return Boolean(
    value &&
      typeof value === 'object' &&
      '_id' in value &&
      'name' in value &&
      'email' in value,
  )
}

export const getEntityId = (value: UserSummary | Id | ProjectRef | null | undefined) => {
  if (!value) {
    return ''
  }

  if (typeof value === 'string') {
    return value
  }

  return value._id ?? ''
}

export const getUserSummary = (value: UserSummary | Id | null | undefined) => {
  if (isUserSummary(value)) {
    return value
  }

  return undefined
}

export const getUserLabel = (value: UserSummary | Id | null | undefined) => {
  if (!value) {
    return 'Unassigned'
  }

  if (typeof value === 'string') {
    return value.slice(0, 8)
  }

  return value.name
}

export const formatDate = (value?: string) => {
  if (!value) {
    return 'No date'
  }

  return new Intl.DateTimeFormat('en-IN', {
    dateStyle: 'medium',
  }).format(new Date(value))
}

export const formatDateTime = (value?: string) => {
  if (!value) {
    return 'Unknown time'
  }

  return new Intl.DateTimeFormat('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value))
}

export const getInitials = (name: string) =>
  name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('')
