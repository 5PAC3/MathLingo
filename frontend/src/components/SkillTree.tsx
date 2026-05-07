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
    const completed = p ? Object.values(p).every((v: { completed: boolean }) => v.completed) : false
    if (!byLevel.has(l)) byLevel.set(l, [])
    byLevel.get(l)!.push({ ...n, level: l, completed })
  }

  return {
    levels: Array.from(byLevel.entries()).sort((a, b) => a[0] - b[0]).map(([, v]) => v),
    edges: tree.edges,
  }
}

function categoryColor(cat: string): string {
  const colors: Record<string, string> = {
    aritmetica: '#4361ee',
    algebra: '#e71d36',
    informatica: '#2ec4b6',
  }
  return colors[cat] || '#6c757d'
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

  const layout = useMemo(() => tree ? computeLayout(tree, progress) : null, [tree, progress])

  if (!layout) return <p className="text-center text-muted">Caricamento...</p>

  const nodeWidth = 180
  const nodeHeight = 70
  const gapX = 40
  const gapY = 30

  const colWidth = nodeWidth + gapX

  return (
    <div style={{ overflowX: 'auto', padding: '2rem 1rem' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: gapX,
          minWidth: layout.levels.length * colWidth,
          justifyContent: 'center',
        }}
      >
        {layout.levels.map((nodes, colIdx) => {
          const colLeft = colIdx * colWidth
          const totalHeight = nodes.length * nodeHeight + (nodes.length - 1) * gapY
          return (
            <div key={colIdx} style={{ position: 'relative', flexShrink: 0 }}>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: gapY,
                  minHeight: totalHeight,
                  justifyContent: 'center',
                }}
              >
                {nodes.map(node => (
                  <button
                    key={node.id}
                    onClick={() => onNodeClick(node.id)}
                    title={node.description}
                    style={{
                      width: nodeWidth,
                      padding: '0.75rem 1rem',
                      border: `2px solid ${categoryColor(node.category)}`,
                      borderRadius: 'var(--radius)',
                      background: node.completed ? categoryColor(node.category) : 'var(--card-bg)',
                      color: node.completed ? 'white' : 'var(--fg)',
                      cursor: 'pointer',
                      fontSize: '0.9rem',
                      fontWeight: 600,
                      textAlign: 'center',
                      transition: 'transform 0.15s, box-shadow 0.15s',
                      boxShadow: node.completed ? '0 2px 8px rgba(0,0,0,0.15)' : '0 1px 3px rgba(0,0,0,0.08)',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)' }}
                    onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = node.completed ? '0 2px 8px rgba(0,0,0,0.15)' : '0 1px 3px rgba(0,0,0,0.08)' }}
                  >
                    {node.label}
                    {node.completed && <span style={{ marginLeft: 4 }}>✓</span>}
                  </button>
                ))}
              </div>

              {/* Arrow indicators */}
              <svg
                style={{
                  position: 'absolute',
                  top: 0,
                  left: nodeWidth - 6,
                  width: gapX,
                  height: totalHeight,
                  pointerEvents: 'none',
                }}
              >
                {nodes.map((node, nodeIdx) => {
                  const edgesFrom = layout.edges.filter(e => e.from === node.id)
                  return edgesFrom.map(edge => {
                    const targetLevel = layout.levels.findIndex(l => l.some(n => n.id === edge.to))
                    const targetNodes = layout.levels[targetLevel] || []
                    const targetIdx = targetNodes.findIndex(n => n.id === edge.to)
                    if (targetIdx < 0) return null

                    const y1 = nodeIdx * (nodeHeight + gapY) + nodeHeight / 2
                    const y2 = targetIdx * (nodeHeight + gapY) + nodeHeight / 2
                    const x1 = nodeWidth - 4
                    const x2 = -4

                    return (
                      <line
                        key={`${node.id}-${edge.to}`}
                        x1={x1} y1={y1}
                        x2={x2} y2={y2}
                        stroke="var(--border)"
                        strokeWidth={2}
                        strokeDasharray="4 3"
                        style={{ transition: 'stroke 0.2s' }}
                      />
                    )
                  })
                })}
              </svg>
            </div>
          )
        })}
      </div>
    </div>
  )
}
