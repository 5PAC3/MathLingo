'use client'

import { useState, useEffect, useRef } from 'react'
import { useAuth } from '@/lib/auth'
import { useI18n } from '@/lib/i18n'

interface LoginFormProps {
  onSuccess: () => void
}

export default function LoginForm({ onSuccess }: LoginFormProps) {
  const { t } = useI18n()
  const { login, register } = useAuth()
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const [showPw, setShowPw] = useState(false)
  const usernameRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    usernameRef.current?.focus()
  }, [mode])

  const submitLabel = mode === 'login' ? t('btn.login') : t('btn.register')
  const toggleLabel = mode === 'login' ? t('btn.register.toggle') : t('btn.login.toggle')
  const togglePrompt = mode === 'login' ? t('prompt.no_account') : t('prompt.have_account')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setBusy(true)
    try {
      if (mode === 'login') await login(username, password)
      else await register(username, password)
      onSuccess()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : t('error.generic'))
    } finally {
      setBusy(false)
    }
  }

  return (
    <div
      style={{
        maxWidth: 400,
        margin: '0 auto',
        padding: '3rem 1rem',
      }}
    >
      <div className="card" style={{ padding: '2rem' }}>
        <div className="text-center mb-2">
          <h1
            style={{
              fontSize: '2rem',
              fontWeight: 800,
              letterSpacing: '-0.03em',
            }}
          >
            MathLingo
          </h1>
          <p className="text-muted" style={{ marginTop: '0.25rem' }}>
            {mode === 'login' ? t('heading.login') : t('heading.register')}
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-2"
          style={{ marginTop: '1.5rem' }}
          aria-label={mode === 'login' ? t('aria.login_form') : t('aria.register_form')}
        >
          {error && (
            <div
              role="alert"
              style={{
                background: 'var(--danger-bg)',
                color: 'var(--danger-fg)',
                padding: '0.6rem 0.8rem',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.9rem',
                fontWeight: 500,
              }}
            >
              {error}
            </div>
          )}

          <div>
            <label htmlFor="login-username" style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0,0,0,0)' }}>
              {t('label.username')}
            </label>
            <input
              id="login-username"
              ref={usernameRef}
              placeholder={t('placeholder.username')}
              value={username}
              onChange={e => setUsername(e.target.value)}
              required
              minLength={3}
              autoComplete="username"
            />
          </div>

          <div style={{ position: 'relative' }}>
            <label htmlFor="login-password" style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0,0,0,0)' }}>
              {t('label.password')}
            </label>
            <input
              id="login-password"
              type={showPw ? 'text' : 'password'}
              placeholder={t('placeholder.password')}
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              minLength={4}
              autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
              style={{ paddingRight: '2.5rem' }}
            />
            <button
              type="button"
              className="btn-ghost btn-sm"
              onClick={() => setShowPw(!showPw)}
              aria-label={showPw ? t('aria.hide_password') : t('aria.show_password')}
              style={{
                position: 'absolute',
                right: '0.25rem',
                top: '50%',
                transform: 'translateY(-50%)',
                fontSize: '0.9rem',
                color: 'var(--fg-muted)',
                lineHeight: 1,
                padding: '0.3rem 0.4rem',
              }}
            >
              {showPw ? t('btn.hide') : t('btn.show')}
            </button>
          </div>

          <button
            type="submit"
            className="btn"
            disabled={busy}
            style={{ marginTop: '0.5rem', width: '100%', fontFamily: 'var(--font-mono)' }}
          >
            {busy ? t('btn.loading') : submitLabel}
          </button>
        </form>

        <p
          className="text-center"
          style={{
            marginTop: '1.25rem',
            fontSize: '0.9rem',
            color: 'var(--fg-muted)',
          }}
        >
          {togglePrompt}
          <button
            type="button"
            className="btn-ghost btn-sm"
            style={{
              color: 'var(--primary)',
              fontWeight: 600,
              textDecoration: 'underline',
              textUnderlineOffset: 2,
            }}
            onClick={() => {
              setMode(mode === 'login' ? 'register' : 'login')
              setError('')
            }}
          >
            {toggleLabel}
          </button>
        </p>
      </div>
    </div>
  )
}
