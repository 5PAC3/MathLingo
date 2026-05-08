'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth'
import { api, type PlacementStartResponse, type PlacementAnswerResponse, type PlacementFinishResponse } from '@/lib/api'

type Phase = 'loading' | 'answering' | 'feedback' | 'finishing' | 'done'

export default function PlacementTest() {
  const router = useRouter()
  const { refreshPlacement } = useAuth()
  const [phase, setPhase] = useState<Phase>('loading')
  const [placementId, setPlacementId] = useState('')
  const [questions, setQuestions] = useState<PlacementStartResponse['questions']>([])
  const [currentIdx, setCurrentIdx] = useState(0)
  const [answer, setAnswer] = useState('')
  const [result, setResult] = useState<PlacementAnswerResponse | null>(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [stats, setStats] = useState({ correct: 0, total: 0 })
  const [finishStats, setFinishStats] = useState<PlacementFinishResponse['stats'] | null>(null)
  const [finishError, setFinishError] = useState(false)
  const finishingRef = useRef(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    api.post<PlacementStartResponse>('/placement/start', {}).then(data => {
      setPlacementId(data.placement_id)
      setQuestions(data.questions)
      setPhase('answering')
    }).catch(err => {
      setError(err instanceof Error ? err.message : 'Errore')
      setPhase('done')
    })
  }, [])

  useEffect(() => {
    if (phase === 'answering') {
      inputRef.current?.focus()
    }
  }, [phase, currentIdx])

  const current = questions[currentIdx]
  const totalQuestions = questions.length
  const progressPct = totalQuestions > 0 ? (currentIdx / totalQuestions) * 100 : 0
  const isLast = currentIdx >= totalQuestions - 1

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!current || busy) return
    setBusy(true)
    setError('')
    try {
      const res = await api.post<PlacementAnswerResponse>('/placement/answer', {
        placement_id: placementId,
        question_id: current.id,
        user_answer: answer,
      })
      setResult(res)
      const newTotal = stats.total + 1
      const newCorrect = stats.correct + (res.correct ? 1 : 0)
      setStats({ correct: newCorrect, total: newTotal })
      setPhase('feedback')
      setTimeout(() => {
        setPhase('answering')
        setResult(null)
        setAnswer('')
        if (isLast) {
          setPhase('finishing')
          finishPlacement()
        } else {
          setCurrentIdx(i => i + 1)
        }
      }, res.correct ? 800 : 1500)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Errore')
      setBusy(false)
    } finally {
      setBusy(false)
    }
  }

  const finishPlacement = useCallback(() => {
    if (finishingRef.current) return
    finishingRef.current = true
    setFinishError(false)
    api.post<PlacementFinishResponse>('/placement/finish', {
      placement_id: placementId,
    }).then(finishRes => {
      setFinishStats(finishRes.stats)
      refreshPlacement()
      setPhase('done')
    }).catch(() => {
      finishingRef.current = false
      setFinishError(true)
      setPhase('done')
    })
  }, [placementId, refreshPlacement])

  const goToTree = useCallback(() => {
    router.push('/tree')
  }, [router])

  if (phase === 'loading') {
    return (
      <div className="container" style={{ paddingTop: '2rem' }}>
        <h1 style={{ fontFamily: 'var(--font-mono)', fontSize: '1.3rem', fontWeight: 700, marginBottom: '0.5rem' }}>
          Test di posizionamento
        </h1>
        <p className="text-muted">Preparazione delle domande...</p>
        <div className="spinner" style={{ marginTop: '1rem' }} />
      </div>
    )
  }

  if (phase === 'done') {
    return (
      <div className="container" style={{ paddingTop: '2rem' }}>
        <div className="card" style={{ padding: '2rem' }}>
          <h1 style={{ fontFamily: 'var(--font-mono)', fontSize: '1.3rem', fontWeight: 700, marginBottom: '1rem' }}>
            {finishStats ? 'Test completato!' : 'Test di posizionamento'}
          </h1>

          {finishStats ? (
            <>
              <p className="mb-2">
                Hai risposto correttamente a <strong>{stats.correct}/{stats.total}</strong> domande.
              </p>
              <div style={{ marginTop: '1rem', marginBottom: '1rem' }}>
                {Object.entries(finishStats).map(([cat, s]) => (
                  <div key={cat} className="flex items-center gap-2 mb-1" style={{ fontSize: '0.9rem' }}>
                    <span style={{ fontWeight: 600, minWidth: 120 }}>{cat}:</span>
                    <div className="progress-bar-bg" style={{ flex: 1, maxWidth: 200 }}>
                      <div
                        className="progress-bar-fill"
                        style={{ width: `${s.total > 0 ? (s.correct / s.total) * 100 : 0}%` }}
                      />
                    </div>
                    <span className="text-muted" style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem' }}>
                      {s.correct}/{s.total}
                    </span>
                  </div>
                ))}
              </div>
              <p className="text-muted mb-2" style={{ fontSize: '0.9rem' }}>
                I nodi che conosci già sono stati segnati come completati.
                Puoi iniziare da dove preferisci.
              </p>
            </>
          ) : finishError ? (
            <div>
              <p style={{ color: 'var(--danger)', marginBottom: '1rem' }}>Errore durante il salvataggio del test.</p>
              <div className="flex gap-2" style={{ gap: '0.5rem' }}>
                <button className="btn" onClick={finishPlacement} style={{ padding: '0.75rem 1.5rem' }}>
                  Riprova
                </button>
                <button className="btn btn-outline" onClick={goToTree} style={{ padding: '0.75rem 1.5rem' }}>
                  Salta
                </button>
              </div>
            </div>
          ) : error ? (
            <div>
              <p style={{ color: 'var(--danger)', marginBottom: '1rem' }}>{error}</p>
            </div>
          ) : null}

          {!finishError && (
            <button className="btn" onClick={goToTree} style={{ fontSize: '1rem', padding: '0.75rem 2rem' }}>
              Vai allo Skill Tree →
            </button>
          )}
        </div>
      </div>
    )
  }

  if (!current) return null

  return (
    <div className="container" style={{ paddingTop: '2rem' }}>
      <h1 style={{ fontFamily: 'var(--font-mono)', fontSize: '1.3rem', fontWeight: 700, marginBottom: '0.25rem' }}>
        Test di posizionamento
      </h1>
      <p className="text-muted mb-2" style={{ fontSize: '0.85rem' }}>
        Rispondi a {totalQuestions} domande per valutare il tuo livello
      </p>

      <div
        className="progress-bar-bg"
        role="progressbar"
        aria-valuenow={Math.round(progressPct)}
        aria-valuemin={0}
        aria-valuemax={100}
        style={{ marginBottom: '1.5rem' }}
      >
        <div className="progress-bar-fill" style={{ width: `${progressPct}%` }} />
      </div>

      <div className="card" style={{ padding: '1.5rem' }}>
        <div className="flex items-center justify-between mb-2">
          <span className="badge" style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem' }}>
            {currentIdx + 1}/{totalQuestions}
          </span>
          <span className="text-muted" style={{ fontSize: '0.8rem' }}>
            {stats.correct}/{stats.total} corrette
          </span>
        </div>

        <p style={{ fontSize: '1.1rem', fontWeight: 600, lineHeight: 1.5, marginBottom: '1rem' }}>
          {current.question}
        </p>

        <form onSubmit={handleSubmit} className="exercise-form" style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
          <label htmlFor="placement-answer" style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0,0,0,0)' }}>
            La tua risposta
          </label>
          <div className="terminal-input-wrapper">
            <span className="terminal-prompt" aria-hidden="true">$</span>
            <input
              id="placement-answer"
              ref={inputRef}
              value={answer}
              onChange={e => setAnswer(e.target.value)}
              placeholder="x = ..."
              disabled={phase === 'feedback' || busy}
              autoComplete="off"
              spellCheck={false}
            />
          </div>
          <button
            type="submit"
            className="btn"
            disabled={phase === 'feedback' || busy || !answer.trim()}
            style={{ flexShrink: 0 }}
          >
            {busy ? 'Verifica...' : 'Verifica'}
          </button>
        </form>

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
          <p style={{ color: 'var(--danger)', marginTop: '0.5rem', fontSize: '0.85rem', fontFamily: 'var(--font-mono)' }}>
            {error}
          </p>
        )}

        {phase === 'feedback' && result && (
          <div
            role="status"
            aria-live="polite"
            className={result.correct ? 'pass' : 'fail'}
            style={{ marginTop: '0.75rem' }}
          >
            <p>{result.correct ? 'PASS' : 'FAIL'}</p>
            {!result.correct && (
              <p className="fail-detail">
                expected: <strong>{result.expected}</strong>
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
