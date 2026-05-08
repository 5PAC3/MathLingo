'use client'

import { useMemo } from 'react'
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
    geometria: 'var(--cat-geometria)',
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
      if (p && Object.values(p).every((l) => l.completed)) {
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
              role="treeitem"
              aria-label={`${macro.label} — ${macro.description}`}
              onClick={() => onMacroClick(macro.id)}
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
