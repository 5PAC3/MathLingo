'use client'

import { useState } from 'react'
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

  const loadExercise = async () => {
    setBusy(true)
    setError('')
    setResult(null)
    setAnswer('')
    setShowHints(false)
    try {
      const data = await api.post<ExerciseData>('/exercise/generate', { node_id: nodeId, level })
      setExercise(data)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Errore')
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
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Errore')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div>
      {!exercise ? (
        <div className="text-center">
          <p className="text-muted mb-2">Premi &ldquo;Nuovo esercizio&rdquo; per iniziare</p>
          <button className="btn" onClick={loadExercise} disabled={busy}>
            {busy ? 'Caricamento...' : 'Nuovo esercizio'}
          </button>
        </div>
      ) : (
        <div>
          <div className="flex items-center justify-between mb-2">
            <p style={{ fontSize: '1.1rem', fontWeight: 600 }}>{exercise.question}</p>
            <button className="btn btn-sm btn-outline" onClick={loadExercise} disabled={busy}>
              Cambia esercizio
            </button>
          </div>

          <form onSubmit={handleSubmit} className="flex gap-2" style={{ alignItems: 'flex-start' }}>
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
            >
              {busy ? '...' : 'Verifica'}
            </button>
          </form>

          {error && (
            <p style={{ color: 'var(--danger)', marginTop: '0.5rem', fontSize: '0.9rem' }}>{error}</p>
          )}

          {result && (
            <div style={{
              marginTop: '1rem',
              padding: '0.8rem',
              borderRadius: 'var(--radius)',
              background: result.correct ? '#d4edda' : '#f8d7da',
              color: result.correct ? '#155724' : '#721c24',
            }}>
              <p style={{ fontWeight: 600 }}>
                {result.correct ? '✓ Corretto!' : '✗ Non corretto'}
              </p>
              {!result.correct && (
                <p style={{ fontSize: '0.9rem', marginTop: '0.3rem' }}>
                  Risposta corretta: <strong>{result.expected}</strong>
                </p>
              )}
            </div>
          )}

          {exercise.hints.length > 0 && (
            <div style={{ marginTop: '0.8rem' }}>
              <button
                className="btn btn-sm btn-outline"
                onClick={() => setShowHints(!showHints)}
              >
                {showHints ? 'Nascondi' : 'Mostra'} suggerimenti
              </button>
              {showHints && (
                <ul style={{ marginTop: '0.5rem', paddingLeft: '1.2rem', fontSize: '0.9rem', color: 'var(--muted)' }}>
                  {exercise.hints.map((hint, i) => (
                    <li key={i} style={{ marginBottom: '0.3rem' }}>{hint}</li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
