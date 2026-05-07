'use client'

import { useState, useEffect } from 'react'
import { api, type SkillTreeData } from '@/lib/api'
import ExerciseInput from './ExerciseInput'

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

  const nodeInfo = tree?.nodes.find(n => n.id === nodeId)
  const color = nodeInfo ? categoryColor(nodeInfo.category) : 'var(--primary)'

  return (
    <div className="container" style={{ paddingTop: '0.5rem' }}>
      <button
        className="btn btn-sm btn-ghost mb-2"
        onClick={onBack}
        style={{ fontSize: '0.9rem' }}
      >
        ← Torna allo Skill Tree
      </button>

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
            <h1 style={{ fontSize: '1.4rem' }}>{nodeInfo.label}</h1>
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
          style={{
            marginBottom: showTheory && theory ? '0.75rem' : 0,
            fontSize: '0.9rem',
            color: 'var(--fg)',
            fontWeight: 600,
          }}
        >
          {showTheory ? '▼' : '▶'} Teoria
        </button>
        {showTheory && (
          <div
            style={{
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
                {theory.split('\n').map((line, i) => {
                  if (line.startsWith('# '))
                    return (
                      <h2
                        key={i}
                        style={{
                          fontSize: '1.15rem',
                          fontWeight: 700,
                          color: 'var(--fg)',
                          marginTop: '1rem',
                          marginBottom: '0.5rem',
                        }}
                      >
                        {line.slice(2)}
                      </h2>
                    )
                  if (line.startsWith('## '))
                    return (
                      <h3
                        key={i}
                        style={{
                          fontSize: '1.05rem',
                          fontWeight: 600,
                          color: 'var(--fg)',
                          marginTop: '0.75rem',
                          marginBottom: '0.35rem',
                        }}
                      >
                        {line.slice(3)}
                      </h3>
                    )
                  if (line.startsWith('**') && line.endsWith('**'))
                    return (
                      <p
                        key={i}
                        style={{
                          fontWeight: 600,
                          color: 'var(--fg)',
                          marginBottom: '0.25rem',
                        }}
                      >
                        {line.slice(2, -2)}
                      </p>
                    )
                  if (
                    line.startsWith('- ') ||
                    line.startsWith('* ')
                  )
                    return (
                      <li
                        key={i}
                        style={{
                          marginLeft: '1.2rem',
                          marginBottom: '0.15rem',
                        }}
                      >
                        {line.slice(2)}
                      </li>
                    )
                  if (line.startsWith('$$') && line.endsWith('$$'))
                    return (
                      <code
                        key={i}
                        style={{
                          display: 'block',
                          textAlign: 'center',
                          padding: '0.5rem',
                          background: 'var(--bg-alt)',
                          borderRadius: 'var(--radius-sm)',
                          margin: '0.5rem 0',
                          fontSize: '1.05rem',
                          color: 'var(--fg)',
                        }}
                      >
                        {line.slice(2, -2)}
                      </code>
                    )
                  if (line.startsWith('$') && line.endsWith('$'))
                    return (
                      <code
                        key={i}
                        style={{
                          background: 'var(--bg-alt)',
                          padding: '0.1rem 0.3rem',
                          borderRadius: '3px',
                          fontSize: '0.95rem',
                          color: 'var(--fg)',
                        }}
                      >
                        {line.slice(1, -1)}
                      </code>
                    )
                  if (line.trim() === '') return <br key={i} />
                  // Detect table rows (simple pipe tables)
                  if (line.includes('|') && line.includes('-') && line.includes('|'))
                    return null
                  if (line.startsWith('|'))
                    return <p key={i} style={{ marginBottom: '0.2rem', fontFamily: 'monospace', fontSize: '0.85rem' }}>{line}</p>
                  return (
                    <p key={i} style={{ marginBottom: '0.35rem' }}>
                      {line}
                    </p>
                  )
                })}
              </div>
            ) : theoryError ? (
              <p className="text-muted">
                Teoria non disponibile per questo nodo.
              </p>
            ) : (
              <div className="spinner" />
            )}
          </div>
        )}
      </div>

      <div className="card">
        <div className="flex items-center justify-between mb-2" style={{ flexWrap: 'wrap', gap: '0.5rem' }}>
          <h2 style={{ fontSize: '1.1rem' }}>Esercizi</h2>
          <div className="flex gap-1">
            {[1, 2, 3].map(l => (
              <button
                key={l}
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
  )
}
