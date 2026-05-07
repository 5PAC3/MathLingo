'use client'

import { useTheme } from '@/lib/theme'
import { useAuth } from '@/lib/auth'

export default function Navbar() {
  const { theme, toggleTheme } = useTheme()
  const { user, logout } = useAuth()

  const handleLogout = () => {
    logout()
  }

  return (
    <nav className="nav">
      <div className="nav-inner">
        <a href="/tree" style={{
          fontWeight: 800,
          fontSize: '1.15rem',
          color: 'var(--fg)',
          textDecoration: 'none',
          letterSpacing: '-0.02em',
        }}>
          MathLingo
        </a>

        <div className="flex items-center gap-1">
          {user && (
            <>
              <span className="text-muted" style={{ fontSize: '0.85rem', marginRight: '0.25rem' }}>
                {user.username}
              </span>
              <button
                className="btn btn-sm btn-ghost"
                onClick={handleLogout}
                title="Esci"
              >
                ✕
              </button>
            </>
          )}

          <button
            className="btn btn-sm btn-ghost"
            onClick={toggleTheme}
            title={theme === 'light' ? 'Passa a tema scuro' : 'Passa a tema chiaro'}
            style={{ fontSize: '1.1rem' }}
          >
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
        </div>
      </div>
    </nav>
  )
}
