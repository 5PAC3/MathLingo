'use client'

import { useState, useEffect, useMemo, useRef, useCallback, type CSSProperties } from 'react'
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
  const levelsMap = new Map<string, number>()
  const inDegree = new Map<string, number>()
  const adj = new Map<string, string[]>()

  for (const n of tree.nodes) {
    levelsMap.set(n.id, 0)
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
      levelsMap.set(next, Math.max(levelsMap.get(next)!, levelsMap.get(id)! + 1))
      const d = inDegree.get(next)!
      inDegree.set(next, d - 1)
      if (d - 1 === 0) queue.push(next)
    }
  }

  const byLevel = new Map<number, NodeLayout[]>()
  for (const n of tree.nodes) {
    const l = levelsMap.get(n.id) || 0
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
      aria-hidden="true"
      style={{ display: 'block' }}
    >
      <line x1="12" y1="4" x2="12" y2="18" />
      <polyline points="6,12 12,18 18,12" />
    </svg>
  )
}

function skillNodeClass(completed: boolean): string {
  return `skill-node ${completed ? 'skill-node--completed' : ''}`
}

function nodeStyle(color: string, completed: boolean): CSSProperties {
  return {
    flex: '1 1 200px',
    maxWidth: 280,
    minWidth: 160,
    padding: '1rem 1.25rem',
    border: 'none',
    borderLeft: `4px solid ${color}`,
    background: completed
      ? `linear-gradient(135deg, ${color}22, transparent)`
      : 'var(--card-bg)',
    boxShadow: completed
      ? `${color}33 0 0 0 1px inset, var(--shadow)`
      : 'var(--shadow)',
    cursor: 'pointer',
    textAlign: 'left',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.25rem',
  }
}

export default function SkillTree({ onNodeClick }: SkillTreeProps) {
  const [tree, setTree] = useState<SkillTreeData | null>(null)
  const [progress, setProgress] = useState<ProgressData>({})
  const [focusIdx, setFocusIdx] = useState(0)
  const nodeRefs = useRef<(HTMLButtonElement | null)[]>([])
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

  const flatNodes = useMemo(
    () => layout?.levels.flat() ?? [],
    [layout],
  )

  useEffect(() => {
    nodeRefs.current = nodeRefs.current.slice(0, flatNodes.length)
  }, [flatNodes.length])

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

  if (!layout) {
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
      onKeyDown={handleKeyDown}
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
            {nodes.map((node, nodeIdx) => {
              const color = categoryColor(node.category)
              const idx = globalIdx++
              return (
                <button
                  key={node.id}
                  ref={el => { nodeRefs.current[idx] = el }}
                  role="treeitem"
                  aria-label={`${node.label} — ${categoryLabel(node.category)}${node.completed ? ' — Completato' : ''}`}
                  aria-setsize={nodes.length}
                  aria-posinset={nodeIdx + 1}
                  tabIndex={idx === focusIdx ? 0 : -1}
                  onClick={() => onNodeClick(node.id)}
                  title={node.description}
                  className={skillNodeClass(node.completed)}
                  style={nodeStyle(color, node.completed)}
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
                      <span
                        aria-label="Completato"
                        style={{ color, fontSize: '1.1rem' }}
                      >
                        ✓
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
              aria-hidden="true"
            >
              <ArrowIcon />
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
