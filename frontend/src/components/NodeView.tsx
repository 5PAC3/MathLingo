'use client'

import { useEffect, useState, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth'
import { useI18n } from '@/lib/i18n'
import { api, type SkillTreeData } from '@/lib/api'
import { useHotkeys } from '@/lib/hotkeys'
import ExerciseInput from './ExerciseInput'
import katex from 'katex'

interface NodeViewProps {
  nodeId: string
  onBack: () => void
}

const CATEGORY_LABELS: Record<string, string> = {
  aritmetica: 'cat.aritmetica',
  algebra: 'cat.algebra',
  logica: 'cat.logica',
  informatica: 'cat.informatica',
  geometria: 'cat.geometria',
  'geometria-analitica': 'cat.geometria_analitica',
  analisi: 'cat.analisi',
  probabilita: 'cat.probabilita',
}

function categoryColor(cat: string): string {
  const vars: Record<string, string> = {
    aritmetica: 'var(--cat-aritmetica)',
    algebra: 'var(--cat-algebra)',
    logica: 'var(--cat-logica)',
    informatica: 'var(--cat-informatica)',
    geometria: 'var(--cat-geometria)',
    'geometria-analitica': 'var(--cat-geometria-analitica)',
    analisi: 'var(--cat-analisi)',
    probabilita: 'var(--cat-probabilita)',
  }
  return vars[cat] || 'var(--primary)'
}

function renderLine(line: string) {
  if (line.startsWith('$$') && line.endsWith('$$') && line.length > 4) {
    const formula = line.slice(2, -2).trim()
    try {
      return <div dangerouslySetInnerHTML={{ __html: katex.renderToString(formula, { throwOnError: false, displayMode: true }) }} />
    } catch {
      return <pre>{line}</pre>
    }
  }
  const processed = line.replace(/\$([^\$]+)\$/g, (_, formula) => {
    try {
      return katex.renderToString(formula, { throwOnError: false, displayMode: false })
    } catch {
      return formula
    }
  })
  return <span dangerouslySetInnerHTML={{ __html: processed }} />
}

function renderContent(markdown: string) {
  const lines = markdown.split('\n')
  const elements: React.ReactNode[] = []
  let inLatexBlock = false
  let latexBuffer: string[] = []

  lines.forEach((line, i) => {
    if (line.startsWith('$$')) {
      if (inLatexBlock) {
        latexBuffer.push(line.slice(2).trim())
        const formula = latexBuffer.join(' ')
        try {
          elements.push(<div key={i} dangerouslySetInnerHTML={{ __html: katex.renderToString(formula, { throwOnError: false, displayMode: true }) }} />)
        } catch {
          elements.push(<pre key={i}>{latexBuffer.join('\n')}</pre>)
        }
        latexBuffer = []
        inLatexBlock = false
      } else {
        const rest = line.slice(2).trim()
        if (rest.endsWith('$$')) {
          const formula = rest.slice(0, -2).trim()
          try {
            elements.push(<div key={i} dangerouslySetInnerHTML={{ __html: katex.renderToString(formula, { throwOnError: false, displayMode: true }) }} />)
          } catch {
            elements.push(<pre key={i}>{line}</pre>)
          }
        } else {
          if (rest) {
            latexBuffer.push(rest)
          }
          inLatexBlock = true
        }
      }
      return
    }
    if (inLatexBlock) {
      latexBuffer.push(line.trim())
      return
    }

    if (line.startsWith('# ')) {
      elements.push(<h1 key={i} style={{ fontFamily: 'var(--font-mono)', fontSize: '1.3rem', fontWeight: 800, marginTop: '1rem', marginBottom: '0.75rem' }}>{line.slice(2)}</h1>)
    } else if (line.startsWith('## ')) {
      elements.push(<h2 key={i} style={{ fontFamily: 'var(--font-mono)', fontSize: '1.05rem', fontWeight: 700, marginTop: '1rem', marginBottom: '0.5rem' }}>{line.slice(3)}</h2>)
    } else if (line.startsWith('### ')) {
      elements.push(<h3 key={i} style={{ fontFamily: 'var(--font-mono)', fontSize: '0.95rem', fontWeight: 600, marginTop: '0.75rem', marginBottom: '0.4rem' }}>{line.slice(4)}</h3>)
    } else if (line.startsWith('- ')) {
      elements.push(<li key={i} style={{ marginLeft: '1.5rem', marginBottom: '0.2rem' }}>{renderLine(line.slice(2))}</li>)
    } else if (line.startsWith('| ')) {
      if (i === 0 || !lines[i - 1].startsWith('| ')) {
        elements.push(<pre key={i} style={{ fontFamily: 'var(--font-mono)', fontSize: '0.82rem', background: 'var(--bg-alt)', padding: '0.5rem', borderRadius: 'var(--radius-sm)', overflowX: 'auto' }}>{lines.slice(i).filter(l => l.startsWith('|')).join('\n')}</pre>)
      }
    } else if (line.trim() === '') {
      elements.push(<div key={i} style={{ height: '0.5rem' }} />)
    } else {
      elements.push(<p key={i} style={{ lineHeight: 1.7, margin: '0.25rem 0' }}>{renderLine(line)}</p>)
    }
  })

  return elements
}

export default function NodeView({ nodeId, onBack }: NodeViewProps) {
  const { t } = useI18n()
  const router = useRouter()
  const [tree, setTree] = useState<SkillTreeData | null>(null)
  const [theory, setTheory] = useState<string | null>(null)
  const [theoryError, setTheoryError] = useState(false)
  const [level, setLevel] = useState(1)
  const [view, setView] = useState<'theory' | 'exercise'>('theory')
  const [showBackToTop, setShowBackToTop] = useState(false)
  const headingRef = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    api.get<SkillTreeData>('/skilltree').then(setTree).catch(() => console.error('Failed to fetch skilltree'))
    api
      .get<{ content: string }>(`/content/${nodeId}`)
      .then(res => {
        setTheory(res.content)
        setTheoryError(false)
      })
      .catch(() => {
        setTheory(null)
        setTheoryError(true)
      })
  }, [nodeId])

  const nodeInfo = tree?.nodes.find(n => n.id === nodeId)
  const category = nodeInfo?.category

  const handleBack = useCallback(() => {
    if (category) {
      router.push(`/tree/${category}`)
    } else {
      onBack()
    }
  }, [category, router, onBack])

  useHotkeys({
    'Escape': handleBack,
    'e': () => { if (view === 'theory' && !theoryError) setView('exercise') },
    't': () => { if (view === 'exercise') setView('theory') },
    '1': () => { if (view === 'exercise') setLevel(1) },
    '2': () => { if (view === 'exercise') setLevel(2) },
    '3': () => { if (view === 'exercise') setLevel(3) },
  })

  useEffect(() => {
    headingRef.current?.focus()
  }, [nodeId])

  useEffect(() => {
    const onScroll = () => setShowBackToTop(window.scrollY > 400)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const catLabel = category ? t(CATEGORY_LABELS[category] || category) : ''

  return (
    <div style={{ padding: '0.5rem 0' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          fontFamily: 'var(--font-mono)',
          fontSize: '0.78rem',
          color: 'var(--fg-muted)',
          marginBottom: '0.75rem',
          flexWrap: 'wrap',
        }}
      >
        <button
          className="btn-ghost btn-sm"
          onClick={() => router.push('/tree')}
          style={{ fontSize: '0.78rem', padding: 0, color: 'var(--primary)' }}
        >
          {t('breadcrumb.overview')}
        </button>
        <span>/</span>
        {category && (
          <>
            <button
              className="btn-ghost btn-sm"
              onClick={() => router.push(`/tree/${category}`)}
              style={{ fontSize: '0.78rem', padding: 0, color: 'var(--primary)' }}
            >
              {catLabel}
            </button>
            <span>/</span>
          </>
        )}
        <span style={{ fontWeight: 600, color: 'var(--fg)' }}>{nodeInfo?.label || nodeId}</span>
        <span>/</span>
        <span>{view === 'theory' ? t('breadcrumb.theory') : t('breadcrumb.exercises')}</span>
      </div>

      {nodeInfo && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            marginBottom: '1rem',
          }}
        >
          <div
            style={{
              width: 12,
              height: 12,
              borderRadius: '50%',
              background: categoryColor(category || ''),
              flexShrink: 0,
            }}
          />
          <span
            ref={headingRef}
            tabIndex={-1}
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '1.2rem',
              fontWeight: 700,
              outline: 'none',
            }}
          >
            {nodeInfo.label}
          </span>
        </div>
      )}

      {view === 'theory' && (
        <div>
          {theoryError && (
            <div className="card" style={{ borderLeft: '4px solid var(--danger)', padding: '1rem' }}>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.9rem', color: 'var(--danger-fg)', margin: 0 }}>
                {t('error.theory_not_found')}
              </p>
            </div>
          )}
          {theory && !theoryError && (
            <div
              className="card"
              style={{
                padding: '1.25rem',
                borderLeft: `4px solid ${categoryColor(category || '')}`,
                fontSize: '0.92rem',
                lineHeight: 1.7,
              }}
            >
              {renderContent(theory)}
            </div>
          )}

          {!theoryError && (
            <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
              <button
                className="btn"
                onClick={() => setView('exercise')}
                style={{ fontSize: '0.9rem' }}
              >
                {t('btn.exercises')}
                <span className="key-hint" style={{ marginLeft: '0.4rem' }}>{t('key_hint.e')}</span>
              </button>
            </div>
          )}
        </div>
      )}

      {view === 'exercise' && (
        <div>
          <div className="flex items-center gap-2" style={{ marginBottom: '1rem', flexWrap: 'wrap' }}>
            <button
              className="btn btn-sm btn-ghost"
              onClick={() => setView('theory')}
              style={{ fontSize: '0.82rem' }}
            >
              <span className="key-hint">{t('key_hint.t')}</span> {t('btn.theory')}
            </button>

            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.82rem', color: 'var(--fg-muted)', marginLeft: '0.5rem' }}>
              {t('aria.difficulty')}:
            </span>
            {[1, 2, 3].map(l => (
              <button
                key={l}
                className={`btn btn-sm ${level === l ? '' : 'btn-ghost'}`}
                onClick={() => setLevel(l)}
                aria-pressed={level === l}
                style={{ fontSize: '0.8rem' }}
              >
                <span className="key-hint">{l}</span> {t('level.label', { n: l })}
              </button>
            ))}
          </div>

          <ExerciseInput nodeId={nodeId} level={level} />
        </div>
      )}

      {showBackToTop && (
        <button
          className="back-to-top visible"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          aria-label={t('aria.back_to_top')}
        >
          ↑
        </button>
      )}
    </div>
  )
}
