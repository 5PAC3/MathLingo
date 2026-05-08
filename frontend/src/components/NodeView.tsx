'use client'

import { useState, useEffect, useCallback, useRef, type ReactNode } from 'react'
import Link from 'next/link'
import katex from 'katex'
import { api, type SkillTreeData } from '@/lib/api'
import { useHotkeys } from '@/lib/hotkeys'
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

function renderMath(expr: string, displayMode: boolean): { __html: string } {
  try {
    return {
      __html: katex.renderToString(expr, {
        displayMode,
        throwOnError: false,
        output: 'html',
      }),
    }
  } catch {
    return { __html: latexToText(expr) }
  }
}

function renderInline(text: string): ReactNode[] {
  const fragments: Fragment[] = []
  let s = text
  while (s.length > 0) {
    const bold = s.match(/^\*\*(.+?)\*\*/)
    if (bold) { fragments.push({ t: 'bold', v: bold[1] }); s = s.slice(bold[0].length); continue }
    const math = s.match(/^\$(.+?)\$/)
    if (math) { fragments.push({ t: 'math', v: math[1] }); s = s.slice(math[0].length); continue }
    const next = s.search(/\*\*|\$/)
    if (next === -1) { fragments.push({ t: 'text', v: s }); break }
    if (next > 0) { fragments.push({ t: 'text', v: s.slice(0, next) }); s = s.slice(next); continue }
    fragments.push({ t: 'text', v: s[0] }); s = s.slice(1)
  }
  return fragments.map((f, i) => {
    if (f.t === 'bold') return <strong key={i}>{f.v}</strong>
    if (f.t === 'math') return <span key={i} dangerouslySetInnerHTML={renderMath(f.v, false)} />
    return f.v
  })
}

function renderLine(line: string, i: number): ReactNode | null {
  const trim = line.trim()
  if (trim === '') return <br key={i} />

  if (trim.startsWith('#')) {
    const level = trim.match(/^#{1,3}/)?.[0].length || 1
    const text = trim.replace(/^#+\s*/, '')
    if (level === 1) return <h2 key={i} style={{ fontFamily: 'var(--font-mono)', fontSize: '1.1rem', fontWeight: 700, color: 'var(--fg)', marginTop: '1rem', marginBottom: '0.5rem' }}>{renderInline(text)}</h2>
    if (level === 2) return <h3 key={i} style={{ fontFamily: 'var(--font-mono)', fontSize: '1rem', fontWeight: 600, color: 'var(--fg)', marginTop: '0.75rem', marginBottom: '0.35rem' }}>{renderInline(text)}</h3>
    return <h4 key={i} style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, color: 'var(--fg)', marginTop: '0.5rem', marginBottom: '0.25rem' }}>{renderInline(text)}</h4>
  }

  if (line.startsWith('- ') || line.startsWith('* ')) {
    return <li key={i} style={{ marginLeft: '1.2rem', marginBottom: '0.15rem' }}>{renderInline(line.slice(2))}</li>
  }

  if (trim.startsWith('$$') && trim.endsWith('$$')) {
    const math = trim.slice(2, -2)
    return (
      <div
        key={i}
        style={{
          textAlign: 'center',
          padding: '0.6rem 0',
          margin: '0.5rem 0',
        }}
        dangerouslySetInnerHTML={renderMath(math, true)}
      />
    )
  }

  if (line.includes('|') && line.includes('-') && line.includes('|')) return null
  if (line.startsWith('|')) return <p key={i} style={{ marginBottom: '0.2rem', fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}>{line}</p>

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
  const vars: Record<string, string> = {
    aritmetica: 'var(--cat-aritmetica)',
    algebra: 'var(--cat-algebra)',
    informatica: 'var(--cat-informatica)',
  }
  return vars[cat] || 'var(--primary)'
}

export default function NodeView({ nodeId, onBack }: NodeViewProps) {
  const [tree, setTree] = useState<SkillTreeData | null>(null)
  const [theory, setTheory] = useState<string | null>(null)
  const [theoryError, setTheoryError] = useState(false)
  const [level, setLevel] = useState(1)
  const [showTheory, setShowTheory] = useState(true)
  const [showBackToTop, setShowBackToTop] = useState(false)
  const headingRef = useRef<HTMLHeadingElement>(null)

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

  useHotkeys({
    'Escape': onBack,
    't': () => setShowTheory(v => !v),
    '1': () => setLevel(1),
    '2': () => setLevel(2),
    '3': () => setLevel(3),
  })

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
          <span aria-hidden="true">/</span>
          <span aria-current="page">{nodeLabel}</span>
        </nav>

        {nodeInfo && (
          <div
            className="card mb-2"
            style={{
              borderLeft: `4px solid ${color}`,
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              flexWrap: 'wrap',
            }}
          >
            <div className="flex items-center gap-2">
              <div
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: '50%',
                  background: color,
                  flexShrink: 0,
                }}
              />
              <h1
                ref={headingRef}
                tabIndex={-1}
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '1.3rem',
                  fontWeight: 700,
                }}
              >
                {nodeInfo.label}
              </h1>
            </div>
            <span
              className="badge"
              style={{
                background: `${color}18`,
                color,
              }}
            >
              {CATEGORY_LABELS[nodeInfo.category] || nodeInfo.category}
            </span>
            <p className="text-muted w-full" style={{ fontSize: '0.9rem', marginTop: '-0.25rem' }}>
              {nodeInfo.description}
            </p>
          </div>
        )}

        <div className="card mb-2 double-border">
          <button
            className="btn btn-sm btn-ghost"
            onClick={() => setShowTheory(!showTheory)}
            aria-expanded={showTheory}
            aria-controls="theory-content"
            style={{
              marginBottom: showTheory && theory ? '0.75rem' : 0,
              fontSize: '0.85rem',
              fontFamily: 'var(--font-mono)',
              fontWeight: 600,
              color: 'var(--fg)',
            }}
          >
            <span
              style={{
                display: 'inline-block',
                transition: 'transform 0.2s ease',
                transform: showTheory ? 'rotate(90deg)' : 'rotate(0deg)',
              }}
            >
              ▸
            </span>{' '}
            Teoria <kbd className="shortcut-hint">t</kbd>
          </button>
          <div
            id="theory-content"
            style={{
              display: showTheory ? 'block' : 'none',
              lineHeight: 1.8,
              color: 'var(--fg-muted)',
              fontSize: '0.92rem',
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
            <h2
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '1rem',
                fontWeight: 700,
              }}
            >
              Esercizi
            </h2>
            <div className="flex gap-1" role="tablist" aria-label="Livello di difficoltà">
              {[1, 2, 3].map(l => (
                <button
                  key={l}
                  role="tab"
                  aria-selected={level === l}
                  className={`btn btn-sm ${level === l ? 'btn' : 'btn-outline'}`}
                  onClick={() => setLevel(l)}
                  style={{ gap: '0.2rem' }}
                >
                  Liv. {l} <kbd className="shortcut-hint">{l}</kbd>
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
