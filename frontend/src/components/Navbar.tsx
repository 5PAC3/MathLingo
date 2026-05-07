'use client'

import { useTheme } from '@/lib/theme'
import { useAuth } from '@/lib/auth'

export default function Navbar() {
  const { theme, toggleTheme } = useTheme()
  const { user, logout } = useAuth()

  return (
    <nav aria-label="Navigazione principale">
      <div className="nav">
        <div className="nav-inner">
          <a
            href="/tree"
            aria-label="MathLingo — home"
            style={{
              fontWeight: 800,
              fontSize: '1.15rem',
              color: 'var(--fg)',
              textDecoration: 'none',
              letterSpacing: '-0.02em',
              transition: 'opacity var(--transition)',
            }}
            onMouseEnter={e => { e.currentTarget.style.opacity = '0.7' }}
            onMouseLeave={e => { e.currentTarget.style.opacity = '1' }}
            onFocus={e => { e.currentTarget.style.opacity = '0.7' }}
            onBlur={e => { e.currentTarget.style.opacity = '1' }}
          >
            MathLingo
          </a>

          <div className="flex items-center gap-1">
            {user && (
              <>
                <span className="text-muted" style={{ fontSize: '0.85rem' }}>
                  {user.username}
                </span>
                <button
                  className="btn btn-sm btn-ghost"
                  onClick={logout}
                  aria-label="Esci"
                  style={{ fontSize: '0.85rem' }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </>
            )}

            <button
              className="btn btn-sm btn-ghost"
              onClick={toggleTheme}
              aria-label={theme === 'light' ? 'Passa a tema scuro' : 'Passa a tema chiaro'}
              style={{ fontSize: '1.1rem', lineHeight: 1 }}
            >
              {theme === 'light' ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                </svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <circle cx="12" cy="12" r="5" />
                  <line x1="12" y1="1" x2="12" y2="3" />
                  <line x1="12" y1="21" x2="12" y2="23" />
                  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                  <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                  <line x1="1" y1="12" x2="3" y2="12" />
                  <line x1="21" y1="12" x2="23" y2="12" />
                  <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                  <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}
