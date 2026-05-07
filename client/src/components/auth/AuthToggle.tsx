import { Button } from '../ui/Button'

export const AuthToggle = ({
  mode,
  onToggle,
}: {
  mode: 'login' | 'register'
  onToggle: (mode: 'login' | 'register') => void
}) => {
  return (
    <div className="auth-toggle">
      <Button variant={mode === 'login' ? 'primary' : 'ghost'} onClick={() => onToggle('login')} type="button">
        Login
      </Button>
      <Button
        variant={mode === 'register' ? 'primary' : 'ghost'}
        onClick={() => onToggle('register')}
        type="button"
      >
        Register
      </Button>
    </div>
  )
}
