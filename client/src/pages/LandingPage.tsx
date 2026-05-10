import { Link } from '@tanstack/react-router'
import { useAuth } from '../context/AuthContext'

export function LandingPage() {
  const { isAuthenticated, isBootstrapping } = useAuth()

  return (
    <div className="page-shell" style={{ minHeight: '100vh', padding: '0', display: 'flex', flexDirection: 'column' }}>
      {/* Navigation */}
      <header className="header" style={{ position: 'fixed', width: '100%', top: 0, zIndex: 50, background: 'rgba(255, 255, 255, 0.8)', backdropFilter: 'blur(12px)' }}>
        <div className="header-left">
          <div className="avatar" style={{ width: 40, height: 40 }}>CH</div>
          <h2 style={{ fontSize: '1.2rem', color: 'var(--text)' }}>CollabHub</h2>
        </div>
        <div className="header-actions">
          {isBootstrapping ? (
            <div style={{ width: 24, height: 24 }} className="spinner"></div>
          ) : isAuthenticated ? (
            <Link to="/workspaces" className="btn btn-primary">Go to Workspaces</Link>
          ) : (
            <>
              <Link to="/auth" className="btn btn-ghost">Sign In</Link>
              <Link to="/auth" className="btn btn-primary">Get Started</Link>
            </>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="content" style={{ marginTop: '80px', display: 'grid', gap: '60px', flex: 1 }}>
        
        {/* Hero Section */}
        <section className="hero-panel" style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: '80px 20px', borderRadius: '40px', margin: '0 auto', maxWidth: '1200px', width: '100%' }}>
          <div className="hero-panel-content" style={{ maxWidth: '800px', margin: '0 auto' }}>
            <span className="eyebrow" style={{ marginBottom: '16px', display: 'inline-block', fontSize: '0.9rem' }}>Introducing CollabHub AI</span>
            <h1 style={{ fontSize: 'clamp(3rem, 5vw, 5rem)', lineHeight: 1.1, marginBottom: '24px', background: 'linear-gradient(135deg, #1d2433, #1d7b72)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontWeight: 800 }}>
              The Intelligent Workspace for Modern Teams
            </h1>
            <p style={{ fontSize: '1.25rem', color: 'var(--muted)', marginBottom: '32px', maxWidth: '650px', margin: '0 auto 40px' }}>
              Streamline your projects, automate task management, and boost team productivity with AI-driven insights. All in one beautifully designed platform.
            </p>
            <div className="hero-actions" style={{ justifyContent: 'center', gap: '16px' }}>
              {isBootstrapping ? (
                <div className="btn btn-primary" style={{ padding: '16px 36px', fontSize: '1.1rem', opacity: 0.7, pointerEvents: 'none' }}>
                  <div style={{ width: 24, height: 24 }} className="spinner"></div>
                </div>
              ) : isAuthenticated ? (
                <Link to="/workspaces" className="btn btn-primary" style={{ padding: '16px 36px', fontSize: '1.1rem' }}>Open App</Link>
              ) : (
                <Link to="/auth" className="btn btn-primary" style={{ padding: '16px 36px', fontSize: '1.1rem' }}>Start for Free</Link>
              )}
              <a href="#features" className="btn btn-secondary" style={{ padding: '16px 36px', fontSize: '1.1rem' }}>Explore Features</a>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" style={{ maxWidth: '1200px', margin: '0 auto', width: '100%', padding: '40px 0' }}>
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <h2 style={{ fontSize: '2.8rem', marginBottom: '16px' }}>Everything you need to work faster</h2>
            <p style={{ fontSize: '1.2rem', color: 'var(--muted)' }}>Powerful features designed to help your team focus on what matters.</p>
          </div>
          
          <div className="metrics-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '32px' }}>
            <div className="signal-card" style={{ padding: '32px', border: '1px solid var(--line)', borderRadius: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
              <div className="icon-btn" style={{ marginBottom: '24px', background: 'var(--accent-soft)', color: 'var(--accent)', border: 'none', width: '56px', height: '56px' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
              </div>
              <h3 style={{ fontSize: '1.4rem', marginBottom: '12px' }}>Smart Workspaces</h3>
              <p style={{ fontSize: '1.05rem', color: 'var(--muted)', lineHeight: 1.6 }}>Organize your projects into dedicated workspaces with role-based access control and custom workflows tailored to your team's needs.</p>
            </div>
            
            <div className="signal-card" style={{ padding: '32px', border: '1px solid var(--line)', borderRadius: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
              <div className="icon-btn" style={{ marginBottom: '24px', background: '#e2f5ef', color: 'var(--teal)', border: 'none', width: '56px', height: '56px' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
              </div>
              <h3 style={{ fontSize: '1.4rem', marginBottom: '12px' }}>AI-Powered Insights</h3>
              <p style={{ fontSize: '1.05rem', color: 'var(--muted)', lineHeight: 1.6 }}>Leverage our built-in AI assistant to automatically summarize tasks, draft quick responses, and intelligently analyze project health.</p>
            </div>
            
            <div className="signal-card" style={{ padding: '32px', border: '1px solid var(--line)', borderRadius: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
              <div className="icon-btn" style={{ marginBottom: '24px', background: '#edf0f6', color: '#485265', border: 'none', width: '56px', height: '56px' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
              </div>
              <h3 style={{ fontSize: '1.4rem', marginBottom: '12px' }}>Real-time Collaboration</h3>
              <p style={{ fontSize: '1.05rem', color: 'var(--muted)', lineHeight: 1.6 }}>Work together seamlessly with live real-time updates, integrated contextual comments, and comprehensive team activity feeds.</p>
            </div>
          </div>
        </section>
        
        {/* Call to Action */}
        <section className="card spotlight-card" style={{ maxWidth: '1200px', margin: '20px auto 40px', width: '100%', textAlign: 'center', padding: '80px 20px', borderRadius: '40px' }}>
          <h2 style={{ fontSize: '3rem', marginBottom: '24px' }}>Ready to transform your workflow?</h2>
          <p style={{ fontSize: '1.25rem', color: 'var(--muted)', marginBottom: '40px', maxWidth: '550px', margin: '0 auto 40px' }}>Join thousands of forward-thinking teams already using CollabHub to deliver their best work.</p>
          {isBootstrapping ? (
            <div className="btn btn-primary" style={{ padding: '16px 36px', fontSize: '1.1rem', opacity: 0.7, pointerEvents: 'none', display: 'inline-flex', margin: '0 auto' }}>
              <div style={{ width: 24, height: 24 }} className="spinner"></div>
            </div>
          ) : isAuthenticated ? (
            <Link to="/workspaces" className="btn btn-primary" style={{ padding: '16px 36px', fontSize: '1.1rem' }}>Go to Workspaces</Link>
          ) : (
            <Link to="/auth" className="btn btn-primary" style={{ padding: '16px 36px', fontSize: '1.1rem' }}>Get Started for Free</Link>
          )}
        </section>

      </main>
      
      {/* Footer */}
      <footer style={{ borderTop: '1px solid var(--line)', padding: '40px 28px', textAlign: 'center', color: 'var(--muted)' }}>
        <p>© {new Date().getFullYear()} CollabHub AI. All rights reserved.</p>
      </footer>
    </div>
  )
}
