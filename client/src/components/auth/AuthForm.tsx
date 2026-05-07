import { useState } from 'react'
import { InputField } from './InputField'
import { AuthToggle } from './AuthToggle'
import { Button } from '../ui/Button'
import { FormField } from '../ui/FormField'

export const AuthForm = ({
  onSubmit,
  busy,
}: {
  onSubmit: (payload: { mode: 'login' | 'register'; name?: string; email: string; password: string }) => Promise<void>
  busy: boolean
}) => {
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  return (
    <form
      className="auth-card"
      onSubmit={async (event) => {
        event.preventDefault()
        await onSubmit({ mode, name, email, password })
      }}
    >
      <div className="hero-copy">
        <p className="eyebrow">CollabHub</p>
        <h1>Build around workspaces, not tabs.</h1>
        <p>
          Sign in to move from workspace selection into projects, tasks, discussion threads, and notification triage
          without losing context.
        </p>
      </div>

      <AuthToggle mode={mode} onToggle={setMode} />

      {mode === 'register' ? (
        <FormField label="Full name">
          <InputField value={name} onChange={(event) => setName(event.target.value)} placeholder="Ada Lovelace" />
        </FormField>
      ) : null}

      <FormField label="Email">
        <InputField
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="team@collabhub.dev"
        />
      </FormField>

      <FormField label="Password">
        <InputField
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="At least 8 characters"
        />
      </FormField>

      <Button type="submit" disabled={busy} fullWidth>
        {busy ? 'Working...' : mode === 'login' ? 'Enter workspace' : 'Create account'}
      </Button>
    </form>
  )
}
