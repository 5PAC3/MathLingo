'use client'

import { useState, useEffect, useMemo, useRef, useCallback } from 'react'
import { api, type SkillTreeData, type ProgressData, type SkillEdge, type SkillNode } from '@/lib/api'
import { useAuth } from '@/lib/auth'

interface SkillTreeProps {
  nodes?: SkillNode[]
  edges?: SkillEdge[]
  progress?: ProgressData
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

function edgesBetweenLevels(
  levels: NodeLayout[][],
  edges: SkillEdge[],
  levelIdx: number,
): SkillEdge[] {
  if (levelIdx >= levels.length - 1) return []
  const current = new Set(levels[levelIdx].map(n => n.id))
  const next = new Set(levels[levelIdx + 1].map(n => n.id))
  return edges.filter(e => current.has(e.from) && next.has(e.to))
}

function getCategoryColor(cat: string): string {
  const vars: Record<string, string> = {
    aritmetica: 'var(--cat-aritmetica)',
    algebra: 'var(--cat-algebra)',
    informatica: 'var(--cat-informatica)',
    geometria: 'var(--cat-geometria)',
    probabilita: 'var(--cat-probabilita)',
  }
  return vars[cat] || 'var(--fg-muted)'
}

function getCategoryLabel(cat: string): string {
  const labels: Record<string, string> = {
    aritmetica: 'Aritmetica',
    algebra: 'Algebra',
    informatica: 'Informatica',
    geometria: 'Geometria',
    probabilita: 'Probabilit\u00e0',
  }
  return labels[cat] || cat
}

function computeLayout(nodes: SkillNode[], edges: SkillEdge[], progress: ProgressData): {
  levels: NodeLayout[][]
  allEdges: SkillEdge[]
} {
  const levelMap = new Map<string, number>()
  const inDegree = new Map<string, number>()
  const adj = new Map<string, string[]>()

  for (const n of nodes) {
    levelMap.set(n.id, 0)
    inDegree.set(n.id, 0)
    adj.set(n.id, [])
  }
  for (const e of edges) {
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
      levelMap.set(next, Math.max(levelMap.get(next)!, levelMap.get(id)! + 1))
      const d = inDegree.get(next)!
      inDegree.set(next, d - 1)
      if (d - 1 === 0) queue.push(next)
    }
  }

  const byLevel = new Map<number, NodeLayout[]>()
  for (const n of nodes) {
    const l = levelMap.get(n.id) || 0
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
    allEdges: edges,
  }
}

function ConnectorArrow() {
  return (
    <div className="connector-arrow" aria-hidden="true">
      │<br />▼
    </div>
  )
}

export default function SkillTree({ nodes: propNodes, edges: propEdges, progress: propProgress, onNodeClick }: SkillTreeProps) {
  const [fetchedTree, setFetchedTree] = useState<SkillTreeData | null>(null)
  const [fetchedProgress, setFetchedProgress] = useState<ProgressData>({})
  const [focusIdx, setFocusIdx] = useState(0)
  const nodeRefs = useRef<(HTMLButtonElement | null)[]>([])
  const { token } = useAuth()

  useEffect(() => {
    if (!propNodes) {
      api.get<SkillTreeData>('/skilltree').then(setFetchedTree)
    }
  }, [propNodes])

  useEffect(() => {
    if (!propProgress && token) {
      api.get<ProgressData>('/progress').then(setFetchedProgress).catch(() => {})
    }
  }, [propProgress, token])

  const nodes = propNodes ?? fetchedTree?.nodes ?? []
  const edges = propEdges ?? fetchedTree?.edges ?? []
  const progress = propProgress ?? fetchedProgress

  const layout = useMemo(
    () => computeLayout(nodes, edges, progress),
    [nodes, edges, progress],
  )

  const flatNodes = useMemo(
    () => layout?.levels.flat() ?? [],
    [layout],
  )

  useEffect(() => {
    nodeRefs.current = nodeRefs.current.slice(0, flatNodes.length)
  }, [flatNodes.length])

  useEffect(() => {
    if (flatNodes.length > 0 && focusIdx === 0) {
      const btn = nodeRefs.current[0]
      if (btn && document.activeElement?.tagName !== 'BUTTON') {
        btn.focus()
      }
    }
  }, [flatNodes.length, focusIdx])

  const focusNode = useCallback((idx: number) => {
    const btn = nodeRefs.current[idx]
    if (btn) {
      btn.focus()
      setFocusIdx(idx)
    }
  }, [])

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    const len = flatNodes.length
    if (len === 0) return

    let next = focusIdx
    switch (e.key) {
      case 'ArrowDown':
      case 'ArrowRight':
        e.preventDefault()
        next = focusIdx + 1 < len ? focusIdx + 1 : 0
        break
      case 'ArrowUp':
      case 'ArrowLeft':
        e.preventDefault()
        next = focusIdx - 1 >= 0 ? focusIdx - 1 : len - 1
        break
      case 'Home':
        e.preventDefault()
        next = 0
        break
      case 'End':
        e.preventDefault()
        next = len - 1
        break
      default:
        return
    }
    focusNode(next)
  }, [focusIdx, flatNodes.length, focusNode])

  if (!propNodes && !fetchedTree) {
    return (
      <div style={{ padding: '3rem 0' }} role="status" aria-label="Caricamento">
        <div className="spinner" />
      </div>
    )
  }

  if (layout.levels.length === 0) {
    return <p className="text-center text-muted">Nessun nodo disponibile.</p>
  }

  let globalIdx = 0

  return (
    <div
      role="tree"
      aria-label="Albero delle competenze"
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
            {nodes.map((node) => {
              const color = getCategoryColor(node.category)
              const idx = globalIdx++
              return (
                <button
                  key={node.id}
                  ref={el => { nodeRefs.current[idx] = el }}
                  role="treeitem"
                  aria-label={`${node.label} — ${getCategoryLabel(node.category)}${node.completed ? ' — Completato' : ''}`}
                  aria-setsize={nodes.length}
                  aria-posinset={idx + 1}
                  tabIndex={idx === focusIdx ? 0 : -1}
                  onClick={() => onNodeClick(node.id)}
                  onKeyDown={handleKeyDown}
                  title={node.description}
                  className={`card skill-node ${node.completed ? 'skill-node-completed' : ''}`}
                  style={{
                    flex: '1 1 200px',
                    maxWidth: 280,
                    minWidth: 160,
                    borderLeft: node.completed ? `4px solid ${color}` : undefined,
                  }}
                >
                  <div className="flex items-center gap-2">
                    <div
                      className="skill-node-dot"
                      style={{ background: color }}
                    />
                    <span
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontWeight: 600,
                        fontSize: '0.9rem',
                        color: 'var(--fg)',
                        lineHeight: 1.3,
                      }}
                    >
                      {node.label}
                    </span>
                    {node.completed && (
                      <span
                        aria-label="Completato"
                        style={{
                          color,
                          fontSize: '0.8rem',
                          marginLeft: 'auto',
                          flexShrink: 0,
                        }}
                      >
                        ◆
                      </span>
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
                    {getCategoryLabel(node.category)}
                  </span>
                </button>
              )
            })}
          </div>

          {levelIdx < layout.levels.length - 1 && (() => {
            const levelEdges = edgesBetweenLevels(layout.levels, edges, levelIdx)
            if (levelEdges.length === 0) return <ConnectorArrow />
            return (
              <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', width: '100%' }}>
                {levelEdges.map(e => (
                  <ConnectorArrow key={`${e.from}-${e.to}`} />
                ))}
              </div>
            )
          })()}
        </div>
      ))}
    </div>
  )
}
