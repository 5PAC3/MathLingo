'use client'

import { useEffect, useState } from 'react'
import { useTheme } from '@/lib/theme'
import { useAuth } from '@/lib/auth'
import { useI18n } from '@/lib/i18n'

export default function Navbar() {
  const { theme, toggleTheme } = useTheme()
  const { user, logout } = useAuth()
  const { lang, setLang, t } = useI18n()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  return (
    <nav aria-label={t('aria.main_nav')}>
      <div className="nav">
        <div className="nav-inner">
          <a
            href="/tree"
            aria-label={t('aria.home')}
            style={{
              fontFamily: 'var(--font-mono)',
              fontWeight: 700,
              fontSize: '1.05rem',
              color: 'var(--fg)',
              textDecoration: 'none',
              letterSpacing: '-0.03em',
            }}
          >
            {t('nav.home')}
          </a>
          <a
            href="/formulario"
            aria-label={t('aria.formulary')}
            style={{
              fontFamily: 'var(--font-mono)',
              fontWeight: 500,
              fontSize: '0.8rem',
              color: 'var(--fg-muted)',
              textDecoration: 'none',
              marginLeft: '0.75rem',
              opacity: 0.7,
              transition: 'opacity 0.2s',
            }}
            onMouseEnter={e => { (e.target as HTMLElement).style.opacity = '1' }}
            onMouseLeave={e => { (e.target as HTMLElement).style.opacity = '0.7' }}
          >
            {t('nav.formulary')}
          </a>

          <div className="flex items-center gap-1" style={{ marginLeft: 'auto' }}>
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
                  aria-label={t('aria.logout')}
                  style={{ fontSize: '0.9rem' }}
                >
                  {t('nav.logout')}
                </button>
              </>
            )}

            {mounted && (
              <button
                className="btn btn-sm btn-ghost"
                onClick={() => setLang(lang === 'it' ? 'en' : 'it')}
                aria-label={t('aria.lang.switch')}
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  lineHeight: 1,
                }}
              >
                {t('nav.lang')}
              </button>
            )}

            {mounted && (
              <button
                className="btn btn-sm btn-ghost"
                onClick={toggleTheme}
                aria-label={theme === 'light' ? t('aria.theme.dark') : t('aria.theme.light')}
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
