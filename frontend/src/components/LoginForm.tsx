'use client'

import { useState } from 'react'
import { useAuth } from '@/lib/auth'

interface LoginFormProps {
  onSuccess: () => void
}

export default function LoginForm({ onSuccess }: LoginFormProps) {
  const { login, register } = useAuth()
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setBusy(true)
    try {
      if (mode === 'login') await login(username, password)
      else await register(username, password)
      onSuccess()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Errore')
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
            {mode === 'login'
              ? 'Accedi al tuo account'
              : 'Crea un nuovo account'}
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-2"
          style={{ marginTop: '1.5rem' }}
        >
          {error && (
            <div
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

          <input
            placeholder="Username"
            value={username}
            onChange={e => setUsername(e.target.value)}
            required
            minLength={3}
            autoFocus
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            minLength={4}
          />

          <button
            type="submit"
            className="btn"
            disabled={busy}
            style={{ marginTop: '0.5rem', width: '100%' }}
          >
            {busy
              ? '...'
              : mode === 'login'
                ? 'Entra'
                : 'Crea account'}
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
          {mode === 'login'
            ? 'Non hai un account? '
            : 'Hai già un account? '}
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
            {mode === 'login' ? 'Registrati' : 'Accedi'}
          </button>
        </p>
      </div>
    </div>
  )
}
