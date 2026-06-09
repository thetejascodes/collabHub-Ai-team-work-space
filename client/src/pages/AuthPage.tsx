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
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
      background: '#f8f9fb',
    }}>

      {/* Left panel — branding */}
      <div style={{
        width: '45%',
        background: 'linear-gradient(160deg, #1d2433 0%, #1a3530 100%)',
        padding: '48px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Grid bg */}
        <div style={{
          position: 'absolute', inset: 0, opacity: 0.05,
          backgroundImage: 'linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }} />
        {/* Glow orb */}
        <div style={{
          position: 'absolute', bottom: -80, right: -80,
          width: 360, height: 360, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(29,123,114,0.35) 0%, transparent 70%)',
        }} />

        <div style={{ position: 'relative' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 64 }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: 'rgba(255,255,255,0.12)',
              border: '1px solid rgba(255,255,255,0.15)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#fff', fontWeight: 700, fontSize: 13,
            }}>CH</div>
            <span style={{ color: '#fff', fontWeight: 600, fontSize: '1.05rem' }}>CollabHub</span>
            <span style={{
              fontSize: 11, fontWeight: 600, padding: '2px 8px',
              background: 'rgba(29,123,114,0.4)', color: '#6de0d0',
              borderRadius: 20, letterSpacing: 0.3,
            }}>AI</span>
          </div>

          <h2 style={{ color: '#fff', fontSize: '2rem', fontWeight: 800, lineHeight: 1.2, marginBottom: 20, letterSpacing: '-0.02em' }}>
            Your team's<br />intelligent workspace
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.95rem', lineHeight: 1.7, maxWidth: 320 }}>
            Manage projects, automate tasks, and collaborate in real time — with AI that actually helps you ship.
          </p>
        </div>

        {/* Testimonials / feature pills */}
        <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 12 }}>
          {[
            { icon: '⚡', text: 'AI-powered task generation' },
            { icon: '🔐', text: 'JWT auth with role-based access' },
            { icon: '📡', text: 'Real-time activity feeds' },
          ].map(item => (
            <div key={item.text} style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '12px 16px', borderRadius: 12,
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.1)',
            }}>
              <span style={{ fontSize: 16 }}>{item.icon}</span>
              <span style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.88rem' }}>{item.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Right panel — form */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '48px 32px',
        position: 'relative',
      }}>

        {/* Error banner */}
        {error && (
          <div style={{
            position: 'absolute', top: 24, left: '50%', transform: 'translateX(-50%)',
            background: '#fde8e8', border: '1px solid #f5b8b8',
            color: '#c43a3a', padding: '12px 20px', borderRadius: 10,
            fontSize: '0.9rem', fontWeight: 500, display: 'flex', alignItems: 'center', gap: 8,
            maxWidth: 400, width: '90%', boxShadow: '0 4px 12px rgba(196,58,58,0.1)',
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            {error}
          </div>
        )}

        <div style={{ width: '100%', maxWidth: 420 }}>
          <div style={{ marginBottom: 32, textAlign: 'center' }}>
            <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#1d2433', marginBottom: 8, letterSpacing: '-0.02em' }}>
              Welcome back
            </h1>
            <p style={{ fontSize: '0.95rem', color: '#8a9ab0' }}>Sign in to your workspace or create a new account</p>
          </div>

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

          <p style={{ textAlign: 'center', fontSize: '0.8rem', color: '#b0b8c8', marginTop: 24 }}>
            By continuing, you agree to our{' '}
            <a href="#" style={{ color: '#1d7b72', textDecoration: 'none' }}>Terms</a>
            {' '}and{' '}
            <a href="#" style={{ color: '#1d7b72', textDecoration: 'none' }}>Privacy Policy</a>
          </p>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          div[style*="width: 45%"] { display: none !important; }
        }
        * { box-sizing: border-box; margin: 0; padding: 0; }
      `}</style>
    </div>
  )
}