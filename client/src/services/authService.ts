import { request } from './apiClient'
import type { AuthResponse, UserSummary } from '../types/api'

export const authService = {
  login(payload: { email: string; password: string }) {
    return request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: payload,
    })
  },
  register(payload: { name: string; email: string; password: string }) {
    return request<AuthResponse>('/auth/register', {
      method: 'POST',
      body: payload,
    })
  },
  getProfile() {
    return request<UserSummary>('/auth/me')
  },
}
