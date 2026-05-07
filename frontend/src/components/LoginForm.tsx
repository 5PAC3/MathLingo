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
    <div style={{ maxWidth: 400, margin: '4rem auto' }}>
      <div className="card">
        <h1 style={{ fontSize: '1.5rem', marginBottom: '1rem', textAlign: 'center' }}>
          MathLingo
        </h1>
        <h2 style={{ fontSize: '1.1rem', marginBottom: '1.5rem', textAlign: 'center', color: 'var(--muted)' }}>
          {mode === 'login' ? 'Accedi al tuo account' : 'Crea un nuovo account'}
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-2">
          {error && (
            <div style={{ background: '#fee', color: 'var(--danger)', padding: '0.5rem 0.8rem', borderRadius: 'var(--radius)', fontSize: '0.9rem' }}>
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

          <button type="submit" className="btn" disabled={busy} style={{ marginTop: '0.5rem' }}>
            {busy ? '...' : mode === 'login' ? 'Entra' : 'Crea account'}
          </button>
        </form>

        <p className="text-center" style={{ marginTop: '1rem', fontSize: '0.9rem', color: 'var(--muted)' }}>
          {mode === 'login' ? 'Non hai un account? ' : 'Hai già un account? '}
          <button
            type="button"
            className="btn-outline btn-sm"
            onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError('') }}
          >
            {mode === 'login' ? 'Registrati' : 'Accedi'}
          </button>
        </p>
      </div>
    </div>
  )
}
