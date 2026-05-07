'use client'

import { useState, useEffect, useCallback, useRef, type ReactNode } from 'react'
import Link from 'next/link'
import { api, type SkillTreeData } from '@/lib/api'
import ExerciseInput from './ExerciseInput'


type Fragment =
  | { t: 'text'; v: string }
  | { t: 'bold'; v: string }
  | { t: 'math'; v: string }

const LATEX_SYMBOLS: Record<string, string> = {
  '\\div': '÷',
  '\\times': '×',
  '\\pm': '±',
  '\\mp': '∓',
  '\\cdot': '·',
  '\\neq': '≠',
  '\\le': '≤',
  '\\ge': '≥',
  '\\to': '→',
  '\\mapsto': '↦',
  '\\forall': '∀',
  '\\exists': '∃',
  '\\in': '∈',
  '\\notin': '∉',
  '\\subset': '⊂',
  '\\supset': '⊃',
  '\\cup': '∪',
  '\\cap': '∩',
  '\\infty': '∞',
  '\\partial': '∂',
  '\\pi': 'π',
  '\\cdots': '⋯',
  '\\vdots': '⋮',
  '\\ddots': '⋱',
  '\\Longrightarrow': '⟹',
  '\\implies': '⟹',
  '\\Longleftrightarrow': '⟺',
  '\\iff': '⟺',
  '\\Leftrightarrow': '⇔',
  '\\Rightarrow': '⇒',
  '\\leftarrow': '←',
  '\\rightarrow': '→',
  '\\leftrightarrow': '↔',
  '\\approx': '≈',
  '\\equiv': '≡',
  '\\cdotp': '·',
  '\\ldots': '…',
  '\\quad': '  ',
  '\\qquad': '    ',
}

const LATEX_BRACED: [RegExp, string][] = [
  [/\\text\{([^}]*)\}/g, '$1'],
  [/\\underbrace\{([^}]*)\}_\{([^}]*)\}/g, '$1 ($2)'],
  [/\\overbrace\{([^}]*)\}^\{([^}]*)\}/g, '$1 ($2)'],
  [/\\frac\{([^}]*)\}\{([^}]*)\}/g, '$1/$2'],
  [/\\sqrt\{([^}]*)\}/g, '√($1)'],
  [/\\sqrt\[(\d+)\]\{([^}]*)\}/g, '$1√($2)'],
]

function latexToText(math: string): string {
  let s = math
  for (const [cmd, sym] of Object.entries(LATEX_SYMBOLS)) {
    s = s.replaceAll(cmd, sym)
  }
  for (const [re, repl] of LATEX_BRACED) {
    s = s.replace(re, repl)
  }
  return s
}

function renderInline(text: string): ReactNode[] {
  const fragments: Fragment[] = []
  let s = text
  while (s.length > 0) {
    const bold = s.match(/^\*\*(.+?)\*\*/)
    if (bold) { fragments.push({ t: 'bold', v: bold[1] }); s = s.slice(bold[0].length); continue }
    const math = s.match(/^\$(.+?)\$/)
    if (math) { fragments.push({ t: 'math', v: latexToText(math[1]) }); s = s.slice(math[0].length); continue }
    const next = s.search(/\*\*|\$/)
    if (next === -1) { fragments.push({ t: 'text', v: s }); break }
    if (next > 0) { fragments.push({ t: 'text', v: s.slice(0, next) }); s = s.slice(next); continue }
    fragments.push({ t: 'text', v: s[0] }); s = s.slice(1)
  }
  return fragments.map((f, i) => {
    if (f.t === 'bold') return <strong key={i}>{f.v}</strong>
    if (f.t === 'math') return <code key={i} style={{ background: 'var(--bg-alt)', padding: '0.1rem 0.35rem', borderRadius: 'var(--radius-sm)', fontSize: '0.95rem', color: 'var(--fg)' }}>{f.v}</code>
    return f.v
  })
}

function renderLine(line: string, i: number): ReactNode | null {
  const trim = line.trim()
  if (trim === '') return <br key={i} />

  if (trim.startsWith('#')) {
    const level = trim.match(/^#{1,3}/)?.[0].length || 1
    const text = trim.replace(/^#+\s*/, '')
    if (level === 1) return <h2 key={i} style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--fg)', marginTop: '1rem', marginBottom: '0.5rem' }}>{renderInline(text)}</h2>
    if (level === 2) return <h3 key={i} style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--fg)', marginTop: '0.75rem', marginBottom: '0.35rem' }}>{renderInline(text)}</h3>
    return <h4 key={i} style={{ fontWeight: 600, color: 'var(--fg)', marginTop: '0.5rem', marginBottom: '0.25rem' }}>{renderInline(text)}</h4>
  }

  if (line.startsWith('- ') || line.startsWith('* ')) {
    return <li key={i} style={{ marginLeft: '1.2rem', marginBottom: '0.15rem' }}>{renderInline(line.slice(2))}</li>
  }

  if (trim.startsWith('$$') && trim.endsWith('$$')) {
    return <code key={i} style={{ display: 'block', textAlign: 'center', padding: '0.5rem', background: 'var(--bg-alt)', borderRadius: 'var(--radius-sm)', margin: '0.5rem 0', fontSize: '1.05rem', color: 'var(--fg)' }}>{latexToText(trim.slice(2, -2))}</code>
  }

  // skip table header/separator rows
  if (line.includes('|') && line.includes('-') && line.includes('|')) return null
  if (line.startsWith('|')) return <p key={i} style={{ marginBottom: '0.2rem', fontFamily: 'monospace', fontSize: '0.85rem' }}>{line}</p>

  return <p key={i} style={{ marginBottom: '0.35rem' }}>{renderInline(line)}</p>
}

interface NodeViewProps {
  nodeId: string
  onBack: () => void
}

const CATEGORY_LABELS: Record<string, string> = {
  aritmetica: 'Aritmetica',
  algebra: 'Algebra',
  informatica: 'Informatica',
}

function categoryColor(cat: string): string {
  const colors: Record<string, string> = {
    aritmetica: '#4361ee',
    algebra: '#e71d36',
    informatica: '#2ec4b6',
  }
  return colors[cat] || '#6c757d'
}

export default function NodeView({ nodeId, onBack }: NodeViewProps) {
  const [tree, setTree] = useState<SkillTreeData | null>(null)
  const [theory, setTheory] = useState<string | null>(null)
  const [theoryError, setTheoryError] = useState(false)
  const [level, setLevel] = useState(1)
  const [showTheory, setShowTheory] = useState(true)
  const [showBackToTop, setShowBackToTop] = useState(false)
  const headingRef = useRef<HTMLHeadingElement>(null)
  const onBackRef = useRef(onBack)
  onBackRef.current = onBack

  useEffect(() => {
    api.get<SkillTreeData>('/skilltree').then(setTree)
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

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !e.repeat) onBackRef.current()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  useEffect(() => {
    headingRef.current?.focus()
  }, [nodeId])

  useEffect(() => {
    const onScroll = () => setShowBackToTop(window.scrollY > 400)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const nodeInfo = tree?.nodes.find(n => n.id === nodeId)
  const color = nodeInfo ? categoryColor(nodeInfo.category) : 'var(--primary)'
  const nodeLabel = nodeInfo?.label || nodeId

  return (
    <>
      <div className="container" style={{ paddingTop: '0.5rem' }}>
        <nav aria-label="Breadcrumb" className="breadcrumb">
          <Link href="/tree">Skill Tree</Link>
          <span aria-hidden="true">›</span>
          <span aria-current="page">{nodeLabel}</span>
        </nav>

        {nodeInfo && (
          <div className="card mb-2" style={{ borderLeft: `4px solid ${color}` }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                marginBottom: '0.35rem',
                flexWrap: 'wrap',
              }}
            >
              <h1 ref={headingRef} tabIndex={-1} style={{ fontSize: '1.4rem' }}>{nodeInfo.label}</h1>
              <span
                className="badge"
                style={{
                  background: `${color}18`,
                  color,
                }}
              >
                {CATEGORY_LABELS[nodeInfo.category] || nodeInfo.category}
              </span>
            </div>
            <p className="text-muted" style={{ fontSize: '0.95rem' }}>
              {nodeInfo.description}
            </p>
          </div>
        )}

      <div className="card mb-2">
        <button
          className="btn btn-sm btn-ghost"
          onClick={() => setShowTheory(!showTheory)}
          aria-expanded={showTheory}
          aria-controls="theory-content"
          style={{
            marginBottom: showTheory && theory ? '0.75rem' : 0,
            fontSize: '0.9rem',
            color: 'var(--fg)',
            fontWeight: 600,
          }}
        >
          <span
            style={{
              display: 'inline-block',
              transition: 'transform 0.2s ease',
              transform: showTheory ? 'rotate(90deg)' : 'rotate(0deg)',
            }}
          >
            ▶
          </span>{' '}
          Teoria
        </button>
        <div
          id="theory-content"
          style={{
            display: showTheory ? 'block' : 'none',
            lineHeight: 1.8,
            color: 'var(--fg-muted)',
            fontSize: '0.94rem',
          }}
        >
          {theory ? (
            <div
              style={{
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
              }}
            >
              {theory.split('\n').map((line, i) => renderLine(line, i))}
            </div>
          ) : theoryError ? (
            <p className="text-muted">
              Teoria non disponibile per questo nodo.
            </p>
          ) : (
            <div className="spinner" />
          )}
        </div>
      </div>

      <div className="card">
        <div className="flex items-center justify-between mb-2" style={{ flexWrap: 'wrap', gap: '0.5rem' }}>
          <h2 style={{ fontSize: '1.1rem' }}>Esercizi</h2>
          <div className="flex gap-1" role="tablist" aria-label="Livello di difficoltà">
            {[1, 2, 3].map(l => (
              <button
                key={l}
                role="tab"
                aria-selected={level === l}
                className={`btn btn-sm ${level === l ? 'btn' : 'btn-outline'}`}
                onClick={() => setLevel(l)}
              >
                Liv. {l}
              </button>
            ))}
          </div>
        </div>
        <ExerciseInput
          key={`${nodeId}-${level}`}
          nodeId={nodeId}
          level={level}
        />
      </div>
    </div>

      <button
        className={`back-to-top ${showBackToTop ? 'visible' : ''}`}
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        aria-label="Torna all'inizio"
      >
        ↑
      </button>
    </>
  )
}
