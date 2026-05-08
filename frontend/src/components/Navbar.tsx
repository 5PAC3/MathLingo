'use client'

import { useEffect, useState } from 'react'
import { useTheme } from '@/lib/theme'
import { useAuth } from '@/lib/auth'

export default function Navbar() {
  const { theme, toggleTheme } = useTheme()
  const { user, logout } = useAuth()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  return (
    <nav aria-label="Navigazione principale">
      <div className="nav">
        <div className="nav-inner">
          <a
            href="/tree"
            aria-label="MathLingo — home"
            style={{
              fontFamily: 'var(--font-mono)',
              fontWeight: 700,
              fontSize: '1.05rem',
              color: 'var(--fg)',
              textDecoration: 'none',
              letterSpacing: '-0.03em',
            }}
          >
            MathLingo
          </a>

          <div className="flex items-center gap-1">
            {user && (
              <>
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.75rem',
                    color: 'var(--fg-muted)',
                    opacity: 0.7,
                  }}
                >
                  {user.username}
                </span>
                <button
                  className="btn btn-sm btn-ghost"
                  onClick={logout}
                  aria-label="Esci"
                  style={{ fontSize: '0.9rem' }}
                >
                  ✕
                </button>
              </>
            )}

            {mounted && (
              <button
                className="btn btn-sm btn-ghost"
                onClick={toggleTheme}
                aria-label={theme === 'light' ? 'Passa a tema scuro' : 'Passa a tema chiaro'}
                style={{ fontSize: '1.05rem', lineHeight: 1 }}
              >
                {theme === 'light' ? '◐' : '☀'}
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
