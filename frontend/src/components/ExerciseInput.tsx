'use client'

import { useState, useCallback } from 'react'
import { api, type ExerciseData, type ValidationResult } from '@/lib/api'

interface ExerciseInputProps {
  nodeId: string
  level: number
}

export default function ExerciseInput({ nodeId, level }: ExerciseInputProps) {
  const [exercise, setExercise] = useState<ExerciseData | null>(null)
  const [answer, setAnswer] = useState('')
  const [result, setResult] = useState<ValidationResult | null>(null)
  const [showHints, setShowHints] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [stats, setStats] = useState({ correct: 0, total: 0 })

  const saveProgress = useCallback(
    async (score: number) => {
      try {
        await api.post('/progress', {
          node_id: nodeId,
          level,
          score,
          completed: score >= 70,
        })
      } catch {
        /* silent */
      }
    },
    [nodeId, level],
  )

  const loadExercise = async () => {
    setBusy(true)
    setError('')
    setResult(null)
    setAnswer('')
    setShowHints(false)
    try {
      const data = await api.post<ExerciseData>('/exercise/generate', {
        node_id: nodeId,
        level,
      })
      setExercise(data)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Errore durante la generazione')
      setExercise(null)
    } finally {
      setBusy(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!exercise) return
    setBusy(true)
    setError('')
    try {
      const data = await api.post<ValidationResult>('/exercise/validate', {
        exercise_id: exercise.exercise_id,
        user_answer: answer,
      })
      setResult(data)

      const newTotal = stats.total + 1
      const newCorrect = stats.correct + (data.correct ? 1 : 0)
      const newStats = { correct: newCorrect, total: newTotal }
      setStats(newStats)

      const score = Math.round((newCorrect / newTotal) * 100)
      await saveProgress(score)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Errore durante la validazione')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div>
      {!exercise ? (
        <div className="text-center" style={{ padding: '1.5rem 0' }}>
          <p className="text-muted mb-2">
            Premi &ldquo;Nuovo esercizio&rdquo; per iniziare
          </p>
          <button className="btn" onClick={loadExercise} disabled={busy}>
            {busy ? 'Caricamento...' : 'Nuovo esercizio'}
          </button>
        </div>
      ) : (
        <div>
          <div
            className="flex items-center justify-between mb-2"
            style={{ gap: '1rem' }}
          >
            <p
              style={{
                fontSize: '1.1rem',
                fontWeight: 600,
                lineHeight: 1.4,
              }}
            >
              {exercise.question}
            </p>
            <button
              className="btn btn-sm btn-outline"
              onClick={loadExercise}
              disabled={busy}
              style={{ flexShrink: 0 }}
            >
              Cambia
            </button>
          </div>

          <form
            onSubmit={handleSubmit}
            className="exercise-form"
            style={{
              display: 'flex',
              gap: '0.5rem',
              alignItems: 'flex-start',
            }}
          >
            <input
              value={answer}
              onChange={e => setAnswer(e.target.value)}
              placeholder="La tua risposta..."
              disabled={!!result || busy}
              style={{ flex: 1 }}
              autoFocus
            />
            <button
              type="submit"
              className="btn"
              disabled={!!result || busy || !answer.trim()}
              style={{ flexShrink: 0 }}
            >
              {busy ? '...' : 'Verifica'}
            </button>
          </form>

          <style>{`
            @media (max-width: 480px) {
              .exercise-form {
                flex-direction: column;
              }
              .exercise-form input {
                width: 100%;
              }
              .exercise-form button {
                width: 100%;
              }
            }
          `}</style>

          {error && (
            <p
              style={{
                color: 'var(--danger)',
                marginTop: '0.5rem',
                fontSize: '0.9rem',
              }}
            >
              {error}
            </p>
          )}

          {result && (
            <div
              style={{
                marginTop: '1rem',
                padding: '0.8rem 1rem',
                borderRadius: 'var(--radius-sm)',
                background: result.correct ? 'var(--success-bg)' : 'var(--danger-bg)',
                color: result.correct ? 'var(--success-fg)' : 'var(--danger-fg)',
                animation: 'fadeIn 0.2s ease',
              }}
            >
              <p style={{ fontWeight: 700 }}>
                {result.correct ? '✓ Corretto!' : '✗ Non corretto'}
              </p>
              {!result.correct && (
                <p style={{ fontSize: '0.9rem', marginTop: '0.25rem' }}>
                  Risposta corretta: <strong>{result.expected}</strong>
                </p>
              )}
            </div>
          )}

          {stats.total > 0 && (
            <div
              style={{
                marginTop: '0.75rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
              }}
            >
              <div
                style={{
                  flex: 1,
                  height: 6,
                  borderRadius: 3,
                  background: 'var(--bg-alt)',
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    width: `${(stats.correct / stats.total) * 100}%`,
                    height: '100%',
                    borderRadius: 3,
                    background: 'var(--success)',
                    transition: 'width 0.3s ease',
                  }}
                />
              </div>
              <span
                className="text-muted"
                style={{
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  whiteSpace: 'nowrap',
                }}
              >
                {stats.correct}/{stats.total}
              </span>
            </div>
          )}

          {exercise.hints.length > 0 && (
            <div style={{ marginTop: '0.75rem' }}>
              <button
                className="btn btn-sm btn-ghost"
                onClick={() => setShowHints(!showHints)}
                style={{
                  color: 'var(--fg-muted)',
                  fontSize: '0.85rem',
                }}
              >
                {showHints ? 'Nascondi' : 'Mostra'} suggerimenti
              </button>
              {showHints && (
                <ul
                  style={{
                    marginTop: '0.5rem',
                    paddingLeft: '1.2rem',
                    fontSize: '0.88rem',
                    color: 'var(--fg-muted)',
                    lineHeight: 1.7,
                  }}
                >
                  {exercise.hints.map((hint, i) => (
                    <li key={i}>{hint}</li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(4px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}
