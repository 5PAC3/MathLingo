'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import { api } from '@/lib/api'
import { useI18n } from '@/lib/i18n'
import type { ExerciseData } from '@/lib/api'

interface ExerciseInputProps {
  nodeId: string
  level: number
  onProgressUpdate?: (correct: number, total: number) => void
}

interface Stats {
  correct: number
  total: number
}

export default function ExerciseInput({ nodeId, level, onProgressUpdate }: ExerciseInputProps) {
  const { t, lang } = useI18n()
  const [exercise, setExercise] = useState<ExerciseData | null>(null)
  const [loading, setLoading] = useState(false)
  const [answer, setAnswer] = useState('')
  const [feedback, setFeedback] = useState<{ correct: boolean; expected: string } | null>(null)
  const [stats, setStats] = useState<Stats>({ correct: 0, total: 0 })
  const [showHints, setShowHints] = useState(false)
  const [shaking, setShaking] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const newExercise = useCallback(async () => {
    setLoading(true)
    setFeedback(null)
    setAnswer('')
    setShowHints(false)
    try {
      const data = await api.post<ExerciseData>('/exercise/generate', { node_id: nodeId, level })
      setExercise(data)
      setTimeout(() => inputRef.current?.focus(), 50)
    } catch {
      alert(t('error.exercise_generation'))
    }
    setLoading(false)
  }, [nodeId, level, t])

  useEffect(() => {
    newExercise()
  }, [newExercise])

  const handleSubmit = useCallback(async () => {
    if (!exercise || submitting) return
    setSubmitting(true)
    setFeedback(null)
    try {
      const data = await api.post<{ correct: boolean; expected: string }>('/exercise/validate', {
        exercise_id: exercise.exercise_id,
        user_answer: answer.trim(),
      })
      setFeedback({ correct: data.correct, expected: data.expected })
      if (data.correct) {
        const newStats = { correct: stats.correct + 1, total: stats.total + 1 }
        setStats(newStats)
        onProgressUpdate?.(newStats.correct, newStats.total)
      } else {
        setShaking(true)
        setTimeout(() => setShaking(false), 500)
        const newStats = { correct: stats.correct, total: stats.total + 1 }
        setStats(newStats)
        onProgressUpdate?.(newStats.correct, newStats.total)
      }
    } catch {
      alert(t('error.validation'))
    }
    setSubmitting(false)
  }, [exercise, answer, submitting, stats, onProgressUpdate, t])

  useShortcut('n', () => { if (!loading) newExercise() })
  useShortcut('h', () => setShowHints(v => !v))
  useShortcut('Enter', () => { if (exercise && !submitting) handleSubmit() }, !!(exercise && !submitting && !feedback))

  return (
    <div>
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
        <button
          className="btn btn-sm"
          onClick={newExercise}
          disabled={loading}
          style={{ fontSize: '0.8rem' }}
        >
          <span className="key-hint">{t('key_hint.n')}</span> {loading ? t('btn.loading_short') : t('btn.change')}
        </button>
        {exercise && (
          <button
            className="btn btn-sm btn-ghost"
            onClick={() => setShowHints(v => !v)}
            style={{ fontSize: '0.8rem' }}
          >
            <span className="key-hint">{t('key_hint.h')}</span> {showHints ? t('btn.hide_hints') : t('btn.show_hints', { count: exercise.hints.length })}
          </button>
        )}
      </div>

      {!exercise && !loading && (
        <p className="text-muted" style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem' }}>
          {t('prompt.new_exercise')}
        </p>
      )}

      {loading && (
        <div style={{ padding: '1rem 0' }}>
          <div className="spinner" />
        </div>
      )}

      {exercise && !loading && (
        <div>
          <div
            className="card"
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '1rem',
              lineHeight: 1.6,
              padding: '1rem',
              marginBottom: '1rem',
            }}
          >
            <div style={{ whiteSpace: 'pre-wrap' }}>{exercise.question}</div>
          </div>

          <div className="flex items-center gap-2" style={{ marginBottom: '0.75rem' }}>
            <div className="terminal-input-wrapper" style={{ flex: 1 }}>
              <span className="terminal-prompt">$</span>
              <input
                ref={inputRef}
                type="text"
                value={answer}
                onChange={e => setAnswer(e.target.value)}
                placeholder={t('placeholder.answer')}
                aria-label={t('placeholder.your_answer')}
                autoComplete="off"
                disabled={!!feedback}
              />
            </div>
            <button
              className={`btn ${shaking ? 'shake' : ''}`}
              onClick={handleSubmit}
              disabled={!answer.trim() || submitting || !!feedback}
              style={{ fontSize: '0.85rem' }}
            >
              {submitting ? t('btn.submit_loading') : t('btn.submit')}
              <span className="key-hint" style={{ marginLeft: '0.35rem' }}>{t('key_hint.ctrl_enter')}</span>
            </button>
          </div>

          {showHints && exercise.hints.length > 0 && (
            <div
              className="card"
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.82rem',
                color: 'var(--fg-muted)',
                background: 'var(--bg-alt)',
                padding: '0.75rem',
                marginBottom: '0.75rem',
              }}
            >
              {exercise.hints.map((hint, i) => (
                <div key={i} style={{ marginBottom: i < exercise.hints.length - 1 ? '0.3rem' : 0 }}>
                  // {hint}
                </div>
              ))}
            </div>
          )}

          {feedback && (
            <div className={feedback.correct ? 'pass' : 'fail'}>
              <strong>{feedback.correct ? t('result.pass') : t('result.fail')}</strong>
              {!feedback.correct && (
                <span> — {t('result.expected')}<strong>{feedback.expected}</strong></span>
              )}
            </div>
          )}

          <div
            className="progress-bar"
            role="progressbar"
            aria-label={t('aria.progress', { correct: stats.correct, total: stats.total })}
            aria-valuenow={stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0}
            aria-valuemin={0}
            aria-valuemax={100}
            style={{ marginTop: '1rem' }}
          >
            <div className="progress-fill" style={{ width: `${stats.total > 0 ? (stats.correct / stats.total) * 100 : 0}%` }} />
          </div>
        </div>
      )}
    </div>
  )
}

function useShortcut(key: string, handler: () => void, enabled = true) {
  useEffect(() => {
    if (!enabled) return
    const listener = (e: KeyboardEvent) => {
      if (e.key === key && !['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) {
        e.preventDefault()
        handler()
      }
    }
    window.addEventListener('keydown', listener)
    return () => window.removeEventListener('keydown', listener)
  }, [key, handler, enabled])
}
