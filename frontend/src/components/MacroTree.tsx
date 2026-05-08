'use client'

import { useMemo, useRef, useCallback, useEffect, useState } from 'react'
import type { MacroNode, SkillNode, ProgressData } from '@/lib/api'

interface MacroTreeProps {
  macros: MacroNode[]
  nodes: SkillNode[]
  progress: ProgressData
  onMacroClick: (macroId: string) => void
}

function getCategoryColor(cat: string): string {
  const vars: Record<string, string> = {
    aritmetica: 'var(--cat-aritmetica)',
    algebra: 'var(--cat-algebra)',
    logica: 'var(--cat-logica)',
    geometria: 'var(--cat-geometria)',
    'geometria-analitica': 'var(--cat-geometria-analitica)',
    analisi: 'var(--cat-analisi)',
    probabilita: 'var(--cat-probabilita)',
  }
  return vars[cat] || 'var(--fg-muted)'
}

function ConnectorArrow() {
  return (
    <div className="connector-arrow" aria-hidden="true">
      │<br />▼
    </div>
  )
}

export default function MacroTree({ macros, nodes, progress, onMacroClick }: MacroTreeProps) {
  const [focusIdx, setFocusIdx] = useState(0)
  const nodeRefs = useRef<(HTMLButtonElement | null)[]>([])

  useEffect(() => {
    nodeRefs.current = nodeRefs.current.slice(0, macros.length)
  }, [macros.length])

  useEffect(() => {
    const btn = nodeRefs.current[0]
    if (btn && document.activeElement?.tagName !== 'BUTTON') {
      btn.focus()
    }
  }, [])

  const focusNode = useCallback((idx: number) => {
    const btn = nodeRefs.current[idx]
    if (btn) {
      btn.focus()
      setFocusIdx(idx)
    }
  }, [])

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    const len = macros.length
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
  }, [focusIdx, macros.length, focusNode])

  const macroProgress = useMemo(() => {
    const byCat: Record<string, { completed: number; total: number }> = {}
    for (const m of macros) {
      byCat[m.id] = { completed: 0, total: 0 }
    }
    for (const node of nodes) {
      const cat = node.category
      if (!byCat[cat]) continue
      byCat[cat].total++
      const p = progress[node.id]
      if (p && Object.values(p).every((l: { completed: boolean }) => l.completed)) {
        byCat[cat].completed++
      }
    }
    return byCat
  }, [macros, nodes, progress])

  return (
    <div
      role="tree"
      aria-label="Percorsi di apprendimento"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '1.5rem 0',
      }}
    >
      {macros.map((macro, idx) => {
        const color = getCategoryColor(macro.category)
        const stat = macroProgress[macro.id]

        return (
          <div key={macro.id} style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <button
              ref={el => { nodeRefs.current[idx] = el }}
              role="treeitem"
              aria-label={`${macro.label} — ${macro.description}`}
              aria-setsize={macros.length}
              aria-posinset={idx + 1}
              tabIndex={idx === focusIdx ? 0 : -1}
              onClick={() => onMacroClick(macro.id)}
              onKeyDown={handleKeyDown}
              className="card skill-node"
              style={{
                flex: '0 1 auto',
                width: '100%',
                maxWidth: 420,
                minWidth: 200,
                borderLeft: `4px solid ${color}`,
                textAlign: 'left',
                cursor: 'pointer',
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
                    fontSize: '0.95rem',
                    color: 'var(--fg)',
                    lineHeight: 1.3,
                  }}
                >
                  {macro.label}
                </span>
              </div>

              <div style={{ paddingLeft: '1.5rem', marginTop: '0.3rem' }}>
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.78rem',
                    color: 'var(--fg-muted)',
                    display: 'block',
                  }}
                >
                  {macro.description}
                </span>
                <span
                  className="badge"
                  style={{
                    background: `${color}18`,
                    color,
                    marginTop: '0.3rem',
                    fontSize: '0.72rem',
                  }}
                >
                  {stat.completed}/{stat.total} completati
                </span>
              </div>
            </button>
            {idx < macros.length - 1 && <ConnectorArrow />}
          </div>
        )
      })}
    </div>
  )
}
