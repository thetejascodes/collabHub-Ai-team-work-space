import type { ApiErrorShape } from '../types/api'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '/api'
const TOKEN_KEY = 'collabhub.token'

export class ApiError extends Error {
  status: number

  constructor(message: string, status: number) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

export const tokenStorage = {
  get() {
    return localStorage.getItem(TOKEN_KEY)
  },
  set(token: string) {
    localStorage.setItem(TOKEN_KEY, token)
  },
  clear() {
    localStorage.removeItem(TOKEN_KEY)
  },
}

type HttpMethod = 'GET' | 'POST' | 'PATCH' | 'DELETE'

interface RequestOptions extends Omit<RequestInit, 'body' | 'method'> {
  body?: unknown
  method?: HttpMethod
}

const getMessage = (payload: ApiErrorShape | null, fallback: string) => {
  if (!payload) {
    return fallback
  }

  return payload.message ?? payload.error ?? fallback
}

export async function request<T>(path: string, options: RequestOptions = {}) {
  const token = tokenStorage.get()
  const headers = new Headers(options.headers)

  headers.set('Accept', 'application/json')

  if (options.body !== undefined) {
    headers.set('Content-Type', 'application/json')
  }

  if (token) {
    headers.set('Authorization', `Bearer ${token}`)
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    method: options.method ?? 'GET',
    headers,
    credentials: 'include',
    body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
  })

  const text = await response.text()
  const payload = text ? (JSON.parse(text) as unknown) : null

  if (!response.ok) {
    throw new ApiError(
      getMessage(payload as ApiErrorShape | null, 'Something went wrong while calling the API.'),
      response.status,
    )
  }

  return payload as T
}
