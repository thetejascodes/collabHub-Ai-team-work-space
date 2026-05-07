import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { AuthForm } from '../components/auth/AuthForm'
import { useAuth } from '../context/AuthContext'

export const AuthPage = () => {
  const { login, register } = useAuth()
  const navigate = useNavigate()
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  return (
    <div className="auth-page">
      <AuthForm
        busy={busy}
        onSubmit={async ({ mode, name, email, password }) => {
          setBusy(true)
          setError(null)

          try {
            if (mode === 'login') {
              await login({ email, password })
            } else {
              await register({ name: name ?? '', email, password })
            }

            await navigate({ to: '/workspaces' })
          } catch (caught) {
            setError(caught instanceof Error ? caught.message : 'Unable to authenticate.')
          } finally {
            setBusy(false)
          }
        }}
      />
      {error ? <p className="error-banner">{error}</p> : null}
    </div>
  )
}
