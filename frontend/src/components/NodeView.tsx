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

export default function NodeView({ nodeId, onBack }: NodeViewProps) {
  const [tree, setTree] = useState<SkillTreeData | null>(null)
  const [theory, setTheory] = useState<string | null>(null)
  const [theoryError, setTheoryError] = useState(false)
  const [level, setLevel] = useState(1)
  const [showTheory, setShowTheory] = useState(true)

  useEffect(() => {
    api.get<SkillTreeData>('/skilltree').then(setTree)
    api.get<{ content: string }>(`/content/${nodeId}`)
      .then(res => { setTheory(res.content); setTheoryError(false) })
      .catch(() => { setTheory(null); setTheoryError(true) })
  }, [nodeId])

  const nodeInfo = tree?.nodes.find(n => n.id === nodeId)

  return (
    <div className="container">
      <button className="btn btn-outline btn-sm mb-2" onClick={onBack}>
        ← Indietro
      </button>

      {nodeInfo && (
        <div className="card mb-2">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
            <h1 style={{ fontSize: '1.5rem' }}>{nodeInfo.label}</h1>
            <span style={{
              fontSize: '0.75rem',
              padding: '0.2rem 0.5rem',
              borderRadius: 'var(--radius)',
              background: 'var(--bg)',
              color: 'var(--muted)',
              fontWeight: 600,
              textTransform: 'uppercase',
            }}>
              {CATEGORY_LABELS[nodeInfo.category] || nodeInfo.category}
            </span>
          </div>
          <p className="text-muted">{nodeInfo.description}</p>
        </div>
      )}

      <div className="card mb-2">
        <button
          className="btn btn-sm btn-outline"
          onClick={() => setShowTheory(!showTheory)}
          style={{ marginBottom: '0.5rem' }}
        >
          {showTheory ? 'Nascondi' : 'Mostra'} teoria
        </button>
        {showTheory && (
          <div style={{ lineHeight: 1.7, color: 'var(--muted)', fontSize: '0.95rem' }}>
            {theory ? (
              <div style={{ whiteSpace: 'pre-wrap' }}>{theory}</div>
            ) : theoryError ? (
              <p>Teoria non disponibile per questo nodo.</p>
            ) : (
              <p>Caricamento...</p>
            )}
          </div>
        )}
      </div>

      <div className="card">
        <div className="flex items-center justify-between mb-2">
          <h2 style={{ fontSize: '1.1rem' }}>Esercizi</h2>
          <div className="flex gap-1">
            {[1, 2, 3].map(l => (
              <button
                key={l}
                className={`btn btn-sm ${level === l ? 'btn' : 'btn-outline'}`}
                onClick={() => setLevel(l)}
              >
                Livello {l}
              </button>
            ))}
          </div>
        </div>
        <ExerciseInput key={`${nodeId}-${level}`} nodeId={nodeId} level={level} />
      </div>
    </div>
  )
}
