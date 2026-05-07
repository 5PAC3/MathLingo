'use client'

import { useState, useEffect, useMemo } from 'react'
import { api, type SkillTreeData, type ProgressData, type SkillEdge } from '@/lib/api'
import { useAuth } from '@/lib/auth'

interface SkillTreeProps {
  onNodeClick: (nodeId: string) => void
}

interface NodeLayout {
  id: string
  label: string
  description: string
  category: string
  level: number
  completed: boolean
}

function categoryColor(cat: string): string {
  const colors: Record<string, string> = {
    aritmetica: '#4361ee',
    algebra: '#e71d36',
    informatica: '#2ec4b6',
  }
  return colors[cat] || '#6c757d'
}

function categoryLabel(cat: string): string {
  const labels: Record<string, string> = {
    aritmetica: 'Aritmetica',
    algebra: 'Algebra',
    informatica: 'Informatica',
  }
  return labels[cat] || cat
}

function computeLayout(tree: SkillTreeData, progress: ProgressData): {
  levels: NodeLayout[][]
  edges: SkillEdge[]
} {
  const levels = new Map<string, number>()
  const inDegree = new Map<string, number>()
  const adj = new Map<string, string[]>()

  for (const n of tree.nodes) {
    levels.set(n.id, 0)
    inDegree.set(n.id, 0)
    adj.set(n.id, [])
  }
  for (const e of tree.edges) {
    adj.get(e.from)?.push(e.to)
    inDegree.set(e.to, (inDegree.get(e.to) || 0) + 1)
  }

  const queue: string[] = []
  for (const [id, deg] of inDegree) {
    if (deg === 0) queue.push(id)
  }
  while (queue.length > 0) {
    const id = queue.shift()!
    for (const next of adj.get(id) || []) {
      levels.set(next, Math.max(levels.get(next)!, levels.get(id)! + 1))
      const d = inDegree.get(next)!
      inDegree.set(next, d - 1)
      if (d - 1 === 0) queue.push(next)
    }
  }

  const byLevel = new Map<number, NodeLayout[]>()
  for (const n of tree.nodes) {
    const l = levels.get(n.id) || 0
    const p = progress[n.id]
    const completed = p
      ? Object.values(p).every((v: { completed: boolean }) => v.completed)
      : false
    if (!byLevel.has(l)) byLevel.set(l, [])
    byLevel.get(l)!.push({ ...n, level: l, completed })
  }

  return {
    levels: Array.from(byLevel.entries())
      .sort((a, b) => a[0] - b[0])
      .map(([, v]) => v),
    edges: tree.edges,
  }
}

function ArrowIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="var(--fg-muted)"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ display: 'block' }}
    >
      <line x1="12" y1="4" x2="12" y2="18" />
      <polyline points="6,12 12,18 18,12" />
    </svg>
  )
}

export default function SkillTree({ onNodeClick }: SkillTreeProps) {
  const [tree, setTree] = useState<SkillTreeData | null>(null)
  const [progress, setProgress] = useState<ProgressData>({})
  const { token } = useAuth()

  useEffect(() => {
    api.get<SkillTreeData>('/skilltree').then(setTree)
  }, [])

  useEffect(() => {
    if (token) {
      api.get<ProgressData>('/progress').then(setProgress).catch(() => {})
    }
  }, [token])

  const layout = useMemo(
    () => (tree ? computeLayout(tree, progress) : null),
    [tree, progress],
  )

  if (!layout) {
    return (
      <div style={{ padding: '3rem 0' }}>
        <div className="spinner" />
      </div>
    )
  }

  if (layout.levels.length === 0) {
    return <p className="text-center text-muted">Nessun nodo disponibile.</p>
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '1.5rem 0',
      }}
    >
      {layout.levels.map((nodes, levelIdx) => (
        <div key={levelIdx} style={{ width: '100%' }}>
          <div
            className="flex flex-wrap justify-center gap-2"
            style={{ width: '100%' }}
          >
            {nodes.map(node => {
              const color = categoryColor(node.category)
              return (
                <button
                  key={node.id}
                  onClick={() => onNodeClick(node.id)}
                  title={node.description}
                  className="card"
                  style={{
                    flex: '1 1 200px',
                    maxWidth: 280,
                    minWidth: 160,
                    padding: '1rem 1.25rem',
                    border: 'none',
                    borderLeft: `4px solid ${color}`,
                    background: node.completed
                      ? `linear-gradient(135deg, ${color}22, transparent)`
                      : 'var(--card-bg)',
                    boxShadow: node.completed
                      ? `${color}33 0 0 0 1px inset, var(--shadow)`
                      : 'var(--shadow)',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition:
                      'transform 0.15s, box-shadow var(--transition)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.25rem',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.transform = 'translateY(-2px)'
                    e.currentTarget.style.boxShadow = 'var(--shadow-hover)'
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.transform = ''
                    e.currentTarget.style.boxShadow = node.completed
                      ? `${color}33 0 0 0 1px inset, var(--shadow)`
                      : 'var(--shadow)'
                  }}
                >
                  <div
                    className="flex items-center justify-between"
                    style={{ gap: '0.5rem' }}
                  >
                    <span
                      style={{
                        fontWeight: 700,
                        fontSize: '0.95rem',
                        color: 'var(--fg)',
                      }}
                    >
                      {node.label}
                    </span>
                    {node.completed && (
                      <span style={{ color, fontSize: '1.1rem' }}>✓</span>
                    )}
                  </div>
                  <span
                    className="badge"
                    style={{
                      background: `${color}18`,
                      color,
                      alignSelf: 'flex-start',
                    }}
                  >
                    {categoryLabel(node.category)}
                  </span>
                </button>
              )
            })}
          </div>

          {levelIdx < layout.levels.length - 1 && (
            <div
              className="flex justify-center"
              style={{
                padding: '0.75rem 0',
                color: 'var(--fg-muted)',
                opacity: 0.5,
              }}
            >
              <ArrowIcon />
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
