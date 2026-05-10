'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth'
import { useI18n } from '@/lib/i18n'
import { api, type PlacementStartResponse, type PlacementAnswerResponse, type PlacementFinishResponse } from '@/lib/api'

export default function PlacementTest() {
  const { t } = useI18n()
  const router = useRouter()
  const { refreshPlacement } = useAuth()
  const [placementId, setPlacementId] = useState<string | null>(null)
  const [questions, setQuestions] = useState<PlacementStartResponse['questions']>([])
  const [currentIdx, setCurrentIdx] = useState(0)
  const [answer, setAnswer] = useState('')
  const [feedback, setFeedback] = useState<{ correct: boolean; expected: string } | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [stats, setStats] = useState<Record<string, { correct: number; total: number }>>({})
  const [finished, setFinished] = useState(false)
  const [finishError, setFinishError] = useState(false)
  const [loading, setLoading] = useState(true)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    api.post<PlacementStartResponse>('/placement/start', {}).then(data => {
      setPlacementId(data.placement_id)
      setQuestions(data.questions)
      setLoading(false)
    }).catch(() => {
      setLoading(false)
    })
  }, [])

  const currentQ = questions[currentIdx]
  const totalQuestions = questions.length

  const handleSubmit = useCallback(async () => {
    if (!placementId || !currentQ || submitting) return
    setSubmitting(true)
    try {
      const data = await api.post<PlacementAnswerResponse & { skipped?: boolean }>('/placement/answer', {
        placement_id: placementId,
        question_id: currentQ.id,
        user_answer: answer.trim(),
      })
      if (data.skipped) {
        await refreshPlacement()
        setFinished(true)
        setSubmitting(false)
        return
      }
      setFeedback({ correct: data.correct, expected: data.expected })
      const cat = currentQ.category
      setStats(prev => ({
        ...prev,
        [cat]: {
          correct: (prev[cat]?.correct ?? 0) + (data.correct ? 1 : 0),
          total: (prev[cat]?.total ?? 0) + 1,
        },
      }))
      setTimeout(() => {
        if (currentIdx < totalQuestions - 1) {
          setCurrentIdx(i => i + 1)
          setFeedback(null)
          setAnswer('')
          inputRef.current?.focus()
        } else {
          finishPlacement()
        }
      }, 800)
    } catch {
      setFinishError(true)
    }
    setSubmitting(false)
  }, [placementId, currentQ, answer, submitting, currentIdx, totalQuestions])

  const finishPlacement = useCallback(async () => {
    if (!placementId) return
    try {
      await api.post<PlacementFinishResponse>('/placement/finish', { placement_id: placementId })
      await refreshPlacement()
      setFinished(true)
    } catch {
      setFinishError(true)
    }
  }, [placementId, refreshPlacement])

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      if (!feedback) handleSubmit()
    }
  }, [handleSubmit, feedback])

  if (loading) {
    return (
      <div className="container" style={{ padding: '3rem 0', textAlign: 'center' }}>
        <div className="spinner" />
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: 'var(--fg-muted)', marginTop: '1rem' }}>
          {t('prompt.placement.preparing')}
        </p>
      </div>
    )
  }

  if (finishError) {
    return (
      <div className="container" style={{ padding: '3rem 0', textAlign: 'center' }}>
        <div className="card" style={{ padding: '2rem' }}>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.9rem', color: 'var(--danger-fg)' }}>
            {t('prompt.placement.error')}
          </p>
          <button className="btn" onClick={finishPlacement} style={{ marginTop: '1rem' }}>
            {t('btn.retry')}
          </button>
        </div>
      </div>
    )
  }

  if (finished) {
    const totalCorrect = Object.values(stats).reduce((acc, s) => acc + s.correct, 0)
    const totalTotal = Object.values(stats).reduce((acc, s) => acc + s.total, 0)
    return (
      <div className="container" style={{ padding: '1rem 0' }}>
        <div className="card" style={{ padding: '1.5rem', textAlign: 'center', borderLeft: '4px solid var(--success)' }}>
          <h1 style={{ fontFamily: 'var(--font-mono)', fontSize: '1.3rem', fontWeight: 700, marginTop: 0 }}>
            {t('prompt.placement.completed')}
          </h1>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.9rem', color: 'var(--fg-muted)' }}>
            {t('prompt.placement.summary', { correct: totalCorrect, total: totalTotal })}
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', justifyContent: 'center', margin: '1rem 0' }}>
            {Object.entries(stats).map(([cat, s]) => (
              <div key={cat} className="card" style={{ padding: '0.75rem', flex: '1 1 120px', minWidth: 100 }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem', color: 'var(--fg-muted)' }}>{t(`cat.${cat}`, {}) || cat}</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1rem', fontWeight: 700, marginTop: '0.3rem' }}>
                  {t('prompt.placement.score', { correct: s.correct, total: s.total })}
                </div>
                <div className="progress-bar" style={{ marginTop: '0.3rem', height: 4 }}>
                  <div className="progress-fill" style={{ width: `${s.total > 0 ? (s.correct / s.total) * 100 : 0}%`, height: 4 }} />
                </div>
              </div>
            ))}
          </div>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.82rem', color: 'var(--fg-muted)', whiteSpace: 'pre-line' }}>
            {t('prompt.placement.info')}
          </p>
          <button className="btn" onClick={() => router.push('/tree')} style={{ marginTop: '1rem' }}>
            {t('btn.go_to_tree')}
          </button>
        </div>
      </div>
    )
  }

  if (!currentQ) return null

  return (
    <div className="container" style={{ padding: '1rem 0' }}>
      <div style={{ marginBottom: '1.5rem', textAlign: 'center' }}>
        <h1 style={{ fontFamily: 'var(--font-mono)', fontSize: '1.3rem', fontWeight: 700 }}>
          {t('heading.placement')}
        </h1>
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: 'var(--fg-muted)' }}>
          {t('prompt.placement', { total: totalQuestions })}
        </p>
      </div>

      <div className="progress-bar" style={{ marginBottom: '1.5rem' }}>
        <div className="progress-fill" style={{ width: `${(currentIdx / totalQuestions) * 100}%` }} />
      </div>

      <div className="card" style={{ padding: '1.25rem', fontFamily: 'var(--font-mono)', fontSize: '1rem', lineHeight: 1.6, marginBottom: '1rem' }}>
        <div style={{ fontSize: '0.75rem', color: 'var(--fg-muted)', marginBottom: '0.5rem' }}>
          {t(`cat.${currentQ.category}`)} — {t('level.label', { n: currentQ.level })}
        </div>
        <div style={{ whiteSpace: 'pre-wrap' }}>{currentQ.question}</div>
      </div>

      <div className="flex items-center gap-2" style={{ marginBottom: '0.75rem' }}>
        <div className="terminal-input-wrapper" style={{ flex: 1 }}>
          <span className="terminal-prompt">$</span>
          <input
            ref={inputRef}
            type="text"
            value={answer}
            onChange={e => setAnswer(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={t('placeholder.answer')}
            aria-label={t('placeholder.your_answer')}
            autoComplete="off"
            disabled={!!feedback}
          />
        </div>
        <button
          className="btn"
          onClick={handleSubmit}
          disabled={!answer.trim() || submitting || !!feedback}
          style={{ fontSize: '0.85rem' }}
        >
          {submitting ? t('btn.submit_loading') : t('btn.submit')}
        </button>
      </div>

      {feedback && (
        <div className={feedback.correct ? 'pass' : 'fail'}>
          <strong>{feedback.correct ? t('result.pass') : t('result.fail')}</strong>
          {!feedback.correct && (
            <span> — {t('result.expected')}<strong>{feedback.expected}</strong></span>
          )}
        </div>
      )}
    </div>
  )
}
