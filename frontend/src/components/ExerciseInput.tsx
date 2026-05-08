'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import { api, type ExerciseData, type ValidationResult } from '@/lib/api'
import { useHotkeys } from '@/lib/hotkeys'

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
  const [focusTarget, setFocusTarget] = useState<'input' | 'result' | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const prevResultRef = useRef<ValidationResult | null>(null)

  useHotkeys({
    'n': () => { if (!busy) loadExercise() },
    'h': () => { if (exercise) setShowHints(v => !v) },
  })

  useEffect(() => {
    if (focusTarget === 'input') inputRef.current?.focus()
    else if (focusTarget === 'result') {
      const el = document.getElementById('exercise-result')
      el?.focus()
    }
    setFocusTarget(null)
  }, [focusTarget])

  useEffect(() => {
    prevResultRef.current = result
  }, [result])

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
      setFocusTarget('input')
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

      setFocusTarget('result')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Errore durante la validazione')
    } finally {
      setBusy(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault()
      const form = (e.target as HTMLElement).closest('form')
      form?.requestSubmit()
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
            {busy ? 'Caricamento...' : 'Nuovo esercizio'} <kbd className="shortcut-hint">n</kbd>
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
                fontSize: '1.05rem',
                fontWeight: 600,
                lineHeight: 1.4,
                overflowWrap: 'break-word',
                wordBreak: 'break-word',
              }}
            >
              {exercise.question}
            </p>
            <button
              className="btn btn-sm btn-outline"
              onClick={loadExercise}
              disabled={busy}
              style={{ flexShrink: 0 }}
              aria-busy={busy}
            >
              {busy ? 'Carica...' : 'Cambia'} <kbd className="shortcut-hint">n</kbd>
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
            <label htmlFor="exercise-answer" style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0,0,0,0)' }}>
              La tua risposta
            </label>
            <div className="terminal-input-wrapper">
              <span className="terminal-prompt" aria-hidden="true">$</span>
              <input
                id="exercise-answer"
                ref={inputRef}
                value={answer}
                onChange={e => setAnswer(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="x = ..."
                disabled={!!result || busy}
                autoComplete="off"
                spellCheck={false}
              />
            </div>
            <button
              type="submit"
              className="btn"
              disabled={!!result || busy || !answer.trim()}
              style={{ flexShrink: 0 }}
            >
              {busy ? 'Verifica...' : 'Verifica'} <kbd className="shortcut-hint">&crarr;</kbd>
            </button>
          </form>

          <div
            style={{
              marginTop: '0.25rem',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.7rem',
              color: 'var(--fg-muted)',
              opacity: 0.4,
              userSelect: 'none',
            }}
            aria-hidden="true"
          >
            ^Enter
          </div>

          <style>{`
            @media (max-width: 480px) {
              .exercise-form {
                flex-direction: column;
              }
              .exercise-form .terminal-input-wrapper {
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
                fontSize: '0.85rem',
                fontFamily: 'var(--font-mono)',
              }}
            >
              {error}
            </p>
          )}

          {result && (
            <div
              id="exercise-result"
              tabIndex={-1}
              role="status"
              aria-live="polite"
              className={result.correct ? 'pass' : 'fail'}
              style={{ outline: 'none' }}
            >
              <p>{result.correct ? 'PASS' : 'FAIL'}</p>
              {!result.correct && (
                <p className="fail-detail">
                  expected: <strong>{result.expected}</strong>
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
              aria-label={`Progresso: ${stats.correct} corretti su ${stats.total} totali`}
            >
              <div
                className="progress-bar-bg"
                role="progressbar"
                aria-valuenow={Math.round((stats.correct / stats.total) * 100)}
                aria-valuemin={0}
                aria-valuemax={100}
              >
                <div
                  className="progress-bar-fill"
                  style={{
                    width: `${(stats.correct / stats.total) * 100}%`,
                  }}
                />
              </div>
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  color: 'var(--fg-muted)',
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
                className="hint-toggle"
                onClick={() => setShowHints(!showHints)}
                aria-expanded={showHints}
                aria-controls="hints-list"
              >
                {showHints ? '// nascondi suggerimenti' : `// mostra suggerimenti (${exercise.hints.length})`} {!showHints && <kbd className="shortcut-hint">h</kbd>}
              </button>
              {showHints && (
                <ul
                  id="hints-list"
                  style={{
                    marginTop: '0.4rem',
                    paddingLeft: 0,
                  }}
                >
                  {exercise.hints.map((hint, i) => (
                    <li key={i} className="hint-item">{hint}</li>
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
