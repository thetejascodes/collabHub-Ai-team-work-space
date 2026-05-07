import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { authService } from '../services/authService'
import { ApiError, tokenStorage } from '../services/apiClient'
import type { UserSummary } from '../types/api'

export interface AuthContextValue {
  user: UserSummary | null
  token: string | null
  isAuthenticated: boolean
  isBootstrapping: boolean
  login: (payload: { email: string; password: string }) => Promise<void>
  register: (payload: { name: string; email: string; password: string }) => Promise<void>
  logout: () => void
  refreshProfile: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserSummary | null>(null)
  const [token, setToken] = useState<string | null>(tokenStorage.get())
  const [isBootstrapping, setIsBootstrapping] = useState(true)

  const syncAuth = (nextToken: string, nextUser: UserSummary) => {
    tokenStorage.set(nextToken)
    setToken(nextToken)
    setUser(nextUser)
  }

  const logout = () => {
    tokenStorage.clear()
    setToken(null)
    setUser(null)
  }

  const refreshProfile = async () => {
    try {
      const profile = await authService.getProfile()
      setUser(profile)
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) {
        logout()
        return
      }

      throw error
    }
  }

  useEffect(() => {
    const bootstrap = async () => {
      if (!tokenStorage.get()) {
        setIsBootstrapping(false)
        return
      }

      try {
        await refreshProfile()
      } catch {
        logout()
      } finally {
        setIsBootstrapping(false)
      }
    }

    void bootstrap()
  }, [])

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      token,
      isAuthenticated: Boolean(user && token),
      isBootstrapping,
      async login(payload) {
        const response = await authService.login(payload)
        syncAuth(response.accessToken, response.user)
      },
      async register(payload) {
        const response = await authService.register(payload)
        syncAuth(response.accessToken, response.user)
      },
      logout,
      refreshProfile,
    }),
    [isBootstrapping, token, user],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider.')
  }

  return context
}
