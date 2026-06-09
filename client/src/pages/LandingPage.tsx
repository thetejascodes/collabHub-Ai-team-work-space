import { Link } from '@tanstack/react-router'
import { useAuth } from '../context/AuthContext'
import { useEffect, useRef, useState } from 'react'

const features = [
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" />
      </svg>
    ),
    color: '#e8f0fe',
    iconColor: '#3b6fd4',
    title: 'Smart Workspaces',
    desc: 'Organize projects into dedicated workspaces with role-based access control and custom workflows built for your team.',
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" />
      </svg>
    ),
    color: '#e2f5ef',
    iconColor: '#1d7b72',
    title: 'AI-Powered Insights',
    desc: 'Auto-summarize tasks, draft responses, and get intelligent project health analysis — all from your built-in AI assistant.',
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
    color: '#f0effe',
    iconColor: '#6c4fd4',
    title: 'Real-time Collaboration',
    desc: 'Live activity feeds, contextual comments, and instant notifications keep your whole team aligned without the noise.',
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
      </svg>
    ),
    color: '#fff4e6',
    iconColor: '#c47d1a',
    title: 'Activity Tracking',
    desc: 'Track every action across your workspace. Know exactly what changed, who changed it, and when — with unread indicators.',
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
      </svg>
    ),
    color: '#e6f7f0',
    iconColor: '#1a8c5c',
    title: 'Task Management',
    desc: 'Hierarchical tasks with Zod-validated inputs, workspace scoping, and full CRUD — structured exactly the way your team works.',
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M18 8h1a4 4 0 0 1 0 8h-1" /><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" />
        <line x1="6" y1="1" x2="6" y2="4" /><line x1="10" y1="1" x2="10" y2="4" /><line x1="14" y1="1" x2="14" y2="4" />
      </svg>
    ),
    color: '#fde8e8',
    iconColor: '#c43a3a',
    title: 'Smart Notifications',
    desc: 'Event-driven alerts via a custom event bus. Get notified about the things that matter, with personal preferences per user.',
  },
]

const stats = [
  { value: '10x', label: 'Faster task setup' },
  { value: '99%', label: 'API uptime' },
  { value: '< 50ms', label: 'Average response' },
  { value: '∞', label: 'Workspaces' },
]

export function LandingPage() {
  const { isAuthenticated, isBootstrapping } = useAuth()
  const [scrolled, setScrolled] = useState(false)
  const heroRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#f8f9fb', fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif" }}>

      {/* Nav */}
      <header style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        padding: '0 32px', height: 64,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: scrolled ? 'rgba(255,255,255,0.92)' : 'transparent',
        backdropFilter: scrolled ? 'blur(16px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(0,0,0,0.07)' : '1px solid transparent',
        transition: 'all 0.3s ease',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: 'linear-gradient(135deg, #1d2433, #1d7b72)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', fontWeight: 700, fontSize: 13, letterSpacing: 0.5,
          }}>CH</div>
          <span style={{ fontWeight: 600, fontSize: '1.05rem', color: '#1d2433', letterSpacing: '-0.01em' }}>CollabHub</span>
          <span style={{
            marginLeft: 4, fontSize: 11, fontWeight: 600, padding: '2px 8px',
            background: '#e2f5ef', color: '#1d7b72', borderRadius: 20, letterSpacing: 0.3,
          }}>AI</span>
        </div>
        <nav style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <a href="#features" style={{ padding: '8px 14px', fontSize: '0.9rem', color: '#555', textDecoration: 'none', borderRadius: 8, transition: 'background 0.2s' }}
            onMouseOver={e => (e.currentTarget.style.background = '#f0f0f0')}
            onMouseOut={e => (e.currentTarget.style.background = 'transparent')}>Features</a>
          {isBootstrapping ? (
            <div style={{ width: 28, height: 28, borderRadius: '50%', border: '2px solid #ddd', borderTopColor: '#1d7b72', animation: 'spin 0.8s linear infinite' }} />
          ) : isAuthenticated ? (
            <Link to="/workspaces" style={{ padding: '8px 20px', background: '#1d2433', color: '#fff', borderRadius: 8, fontSize: '0.9rem', textDecoration: 'none', fontWeight: 500 }}>
              Dashboard →
            </Link>
          ) : (
            <>
              <Link to="/auth" style={{ padding: '8px 16px', fontSize: '0.9rem', color: '#1d2433', textDecoration: 'none', fontWeight: 500, borderRadius: 8, transition: 'background 0.2s' }}
                onMouseOver={e => (e.currentTarget.style.background = '#f0f0f0')}
                onMouseOut={e => (e.currentTarget.style.background = 'transparent')}>Sign in</Link>
              <Link to="/auth" style={{ padding: '8px 20px', background: '#1d2433', color: '#fff', borderRadius: 8, fontSize: '0.9rem', textDecoration: 'none', fontWeight: 500 }}>
                Get started
              </Link>
            </>
          )}
        </nav>
      </header>

      <main style={{ flex: 1, paddingTop: 64 }}>

        {/* Hero */}
        <section ref={heroRef} style={{
          minHeight: '88vh', display: 'flex', flexDirection: 'column',
          justifyContent: 'center', alignItems: 'center', textAlign: 'center',
          padding: '80px 24px 60px',
          background: 'linear-gradient(180deg, #ffffff 0%, #f0f6f5 100%)',
          position: 'relative', overflow: 'hidden',
        }}>
          {/* Subtle grid bg */}
          <div style={{
            position: 'absolute', inset: 0, opacity: 0.035,
            backgroundImage: 'linear-gradient(#1d2433 1px, transparent 1px), linear-gradient(90deg, #1d2433 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }} />

          <div style={{ position: 'relative', maxWidth: 760, margin: '0 auto' }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '6px 16px', borderRadius: 30,
              background: '#e2f5ef', border: '1px solid #9fd8c7',
              fontSize: '0.82rem', fontWeight: 600, color: '#1d7b72',
              marginBottom: 28, letterSpacing: 0.3,
            }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#1d7b72', display: 'inline-block', animation: 'pulse 2s infinite' }} />
              Now in beta — free to get started
            </div>

            <h1 style={{
              fontSize: 'clamp(2.8rem, 6vw, 5rem)', fontWeight: 800,
              lineHeight: 1.08, marginBottom: 24, letterSpacing: '-0.03em',
              color: '#1d2433',
            }}>
              The intelligent workspace<br />
              <span style={{ color: '#1d7b72' }}>built for modern teams</span>
            </h1>

            <p style={{
              fontSize: 'clamp(1rem, 2vw, 1.2rem)', color: '#5a6474',
              maxWidth: 560, margin: '0 auto 40px', lineHeight: 1.7,
            }}>
              Manage projects, automate tasks, and collaborate in real time — with AI that actually helps your team ship faster.
            </p>

            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
              {isBootstrapping ? (
                <div style={{ width: 32, height: 32, borderRadius: '50%', border: '2px solid #ddd', borderTopColor: '#1d7b72', animation: 'spin 0.8s linear infinite' }} />
              ) : isAuthenticated ? (
                <Link to="/workspaces" style={{
                  padding: '14px 32px', background: '#1d2433', color: '#fff',
                  borderRadius: 10, fontSize: '1rem', textDecoration: 'none', fontWeight: 600,
                  transition: 'transform 0.15s, box-shadow 0.15s',
                }}
                  onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(29,36,51,0.2)' }}
                  onMouseOut={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '' }}>
                  Open app →
                </Link>
              ) : (
                <>
                  <Link to="/auth" style={{
                    padding: '14px 32px', background: '#1d2433', color: '#fff',
                    borderRadius: 10, fontSize: '1rem', textDecoration: 'none', fontWeight: 600,
                    transition: 'transform 0.15s, box-shadow 0.15s',
                  }}
                    onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(29,36,51,0.2)' }}
                    onMouseOut={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '' }}>
                    Start for free →
                  </Link>
                  <a href="#features" style={{
                    padding: '14px 28px', background: 'transparent', color: '#1d2433',
                    border: '1.5px solid rgba(29,36,51,0.2)', borderRadius: 10,
                    fontSize: '1rem', textDecoration: 'none', fontWeight: 500,
                  }}>See features</a>
                </>
              )}
            </div>
          </div>

          {/* Floating mock UI card */}
          <div style={{
            marginTop: 64, maxWidth: 780, width: '100%',
            background: '#fff', borderRadius: 20,
            border: '1px solid rgba(0,0,0,0.08)',
            boxShadow: '0 24px 64px rgba(29,36,51,0.1)',
            overflow: 'hidden', position: 'relative',
          }}>
            <div style={{ background: '#f5f6f8', borderBottom: '1px solid #eee', padding: '10px 16px', display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#ff5f57' }} />
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#febc2e' }} />
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#28c840' }} />
              <span style={{ marginLeft: 12, fontSize: 12, color: '#999', fontFamily: 'monospace' }}>collabhub.app/workspaces</span>
            </div>
            <div style={{ padding: '28px 32px', display: 'grid', gridTemplateColumns: '220px 1fr', gap: 24, minHeight: 220 }}>
              <div>
                <p style={{ fontSize: 11, fontWeight: 600, color: '#999', letterSpacing: 1, marginBottom: 12 }}>WORKSPACES</p>
                {['Design System', 'Backend API', 'Mobile App'].map((w, i) => (
                  <div key={w} style={{
                    padding: '8px 12px', borderRadius: 8, marginBottom: 4,
                    background: i === 0 ? '#e2f5ef' : 'transparent',
                    color: i === 0 ? '#1d7b72' : '#555', fontSize: 13, fontWeight: i === 0 ? 600 : 400, cursor: 'default',
                  }}>{w}</div>
                ))}
              </div>
              <div>
                <p style={{ fontSize: 11, fontWeight: 600, color: '#999', letterSpacing: 1, marginBottom: 12 }}>ACTIVE TASKS</p>
                {[
                  { title: 'Update button component tokens', tag: 'UI', color: '#e8f0fe', tc: '#3b6fd4' },
                  { title: 'Fix auth middleware edge case', tag: 'Bug', color: '#fde8e8', tc: '#c43a3a' },
                  { title: 'Write API docs for /workspaces', tag: 'Docs', color: '#fff4e6', tc: '#c47d1a' },
                ].map(t => (
                  <div key={t.title} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '9px 0', borderBottom: '1px solid #f0f0f0' }}>
                    <span style={{ fontSize: 13, color: '#1d2433' }}>{t.title}</span>
                    <span style={{ fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 6, background: t.color, color: t.tc }}>{t.tag}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section style={{ background: '#1d2433', padding: '48px 32px' }}>
          <div style={{ maxWidth: 960, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 32 }}>
            {stats.map(s => (
              <div key={s.label} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '2.4rem', fontWeight: 800, color: '#1d7b72', letterSpacing: '-0.02em' }}>{s.value}</div>
                <div style={{ fontSize: '0.9rem', color: '#8a9ab0', marginTop: 4 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Features */}
        <section id="features" style={{ padding: '100px 32px', background: '#fff' }}>
          <div style={{ maxWidth: 1100, margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: 64 }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, letterSpacing: 1.5, color: '#1d7b72', textTransform: 'uppercase' }}>Features</span>
              <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 800, marginTop: 12, marginBottom: 16, color: '#1d2433', letterSpacing: '-0.02em' }}>
                Everything your team needs
              </h2>
              <p style={{ fontSize: '1.1rem', color: '#6b7a90', maxWidth: 500, margin: '0 auto' }}>
                Powerful tools designed so your team spends less time managing and more time building.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(310px, 1fr))', gap: 24 }}>
              {features.map(f => (
                <div key={f.title} style={{
                  padding: '32px', borderRadius: 20,
                  border: '1px solid #eef0f4',
                  background: '#fafbfc',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                }}
                  onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 12px 32px rgba(0,0,0,0.07)' }}
                  onMouseOut={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '' }}>
                  <div style={{
                    width: 52, height: 52, borderRadius: 14,
                    background: f.color, color: f.iconColor,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    marginBottom: 20,
                  }}>{f.icon}</div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1d2433', marginBottom: 10 }}>{f.title}</h3>
                  <p style={{ fontSize: '0.95rem', color: '#6b7a90', lineHeight: 1.7, margin: 0 }}>{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section style={{
          margin: '0 32px 80px', borderRadius: 28,
          background: 'linear-gradient(135deg, #1d2433 0%, #1d3c36 100%)',
          padding: '80px 32px', textAlign: 'center',
          position: 'relative', overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute', top: -60, right: -60, width: 300, height: 300,
            borderRadius: '50%', background: 'rgba(29,123,114,0.15)',
          }} />
          <div style={{
            position: 'absolute', bottom: -80, left: -40, width: 250, height: 250,
            borderRadius: '50%', background: 'rgba(255,255,255,0.04)',
          }} />
          <div style={{ position: 'relative' }}>
            <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 800, color: '#fff', marginBottom: 16, letterSpacing: '-0.02em' }}>
              Ready to ship faster?
            </h2>
            <p style={{ fontSize: '1.1rem', color: 'rgba(255,255,255,0.6)', marginBottom: 40, maxWidth: 460, margin: '0 auto 40px' }}>
              Join teams already using CollabHub to cut through the noise and focus on work that matters.
            </p>
            {isBootstrapping ? (
              <div style={{ width: 32, height: 32, margin: '0 auto', borderRadius: '50%', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', animation: 'spin 0.8s linear infinite' }} />
            ) : isAuthenticated ? (
              <Link to="/workspaces" style={{ padding: '16px 36px', background: '#1d7b72', color: '#fff', borderRadius: 12, fontSize: '1rem', textDecoration: 'none', fontWeight: 600 }}>
                Go to workspaces →
              </Link>
            ) : (
              <Link to="/auth" style={{ padding: '16px 36px', background: '#1d7b72', color: '#fff', borderRadius: 12, fontSize: '1rem', textDecoration: 'none', fontWeight: 600, display: 'inline-block' }}>
                Get started for free →
              </Link>
            )}
          </div>
        </section>
      </main>

      <footer style={{ borderTop: '1px solid #eef0f4', padding: '32px', textAlign: 'center', background: '#fff' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 12 }}>
          <div style={{ width: 28, height: 28, borderRadius: 8, background: 'linear-gradient(135deg, #1d2433, #1d7b72)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 10 }}>CH</div>
          <span style={{ fontWeight: 600, fontSize: '0.95rem', color: '#1d2433' }}>CollabHub AI</span>
        </div>
        <p style={{ fontSize: '0.85rem', color: '#9aa3b0' }}>© {new Date().getFullYear()} CollabHub AI. All rights reserved.</p>
      </footer>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
        * { box-sizing: border-box; margin: 0; padding: 0; }
      `}</style>
    </div>
  )
}