'use client'

import { useState, useEffect, useCallback } from 'react'
import { useHotkeys } from '@/lib/hotkeys'
import { usePathname } from 'next/navigation'

interface ShortcutEntry {
  key: string
  desc: string
}

interface ShortcutSection {
  section: string
  keys: ShortcutEntry[]
}

const GLOBAL: ShortcutSection = {
  section: 'Global',
  keys: [
    { key: '?', desc: 'Apri/chiudi aiuto' },
    { key: 'Escape', desc: 'Chiudi / indietro' },
  ],
}

const TREE: ShortcutSection = {
  section: 'Skill Tree',
  keys: [
    { key: '\u2191 \u2193 \u2190 \u2192', desc: 'Naviga nodi' },
    { key: 'Enter', desc: 'Apri nodo' },
  ],
}

const NODE_THEORY: ShortcutSection = {
  section: 'Nodo (teoria)',
  keys: [
    { key: 'e', desc: 'Vai agli esercizi' },
    { key: 'Escape', desc: 'Torna allo skill tree' },
  ],
}

const NODE_EXERCISE: ShortcutSection = {
  section: 'Nodo (esercizi)',
  keys: [
    { key: 't', desc: 'Torna alla teoria' },
    { key: '1 2 3', desc: 'Seleziona livello' },
    { key: 'n', desc: 'Nuovo esercizio' },
    { key: 'h', desc: 'Suggerimenti' },
    { key: 'Enter', desc: 'Invia risposta' },
    { key: '^Enter', desc: 'Invia risposta' },
    { key: 'Escape', desc: 'Torna allo skill tree' },
  ],
}

export default function KeyboardShortcutsHelp() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  useHotkeys({
    '?': () => setOpen((v) => !v),
    'Escape': () => setOpen(false),
  })

  const onKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Escape') setOpen(false)
  }, [])

  useEffect(() => {
    if (open) {
      const el = document.getElementById('shortcuts-help')
      el?.focus()
    }
  }, [open])

  useEffect(() => {
    setOpen(false)
  }, [pathname])

  const isTree = pathname === '/tree'
  const isNode = pathname.startsWith('/node/')

  const sections = [GLOBAL]
  if (isTree) sections.push(TREE)
  if (isNode) sections.push(NODE_THEORY, NODE_EXERCISE)

  return (
    <>
      <button
        className="help-indicator"
        onClick={() => setOpen(true)}
        aria-label="Aiuto scorciatoie da tastiera"
        title="Scorciatoie da tastiera"
      >
        [?] aiuto
      </button>

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Scorciatoie da tastiera"
          className="help-overlay"
          onKeyDown={onKeyDown}
          onClick={(e) => {
            if (e.target === e.currentTarget) setOpen(false)
          }}
        >
          <div className="help-panel" id="shortcuts-help" tabIndex={-1}>
            <div className="help-header">
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.9rem',
                  fontWeight: 700,
                }}
              >
                Keyboard Shortcuts
              </span>
              <button
                className="btn btn-sm btn-ghost"
                onClick={() => setOpen(false)}
                aria-label="Chiudi"
                style={{ fontSize: '0.9rem' }}
              >
                ✕
              </button>
            </div>

            {sections.map((sec) => (
              <div key={sec.section} style={{ marginTop: '0.75rem' }}>
                <p
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.65rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    color: 'var(--fg-muted)',
                    marginBottom: '0.35rem',
                    opacity: 0.6,
                  }}
                >
                  ── {sec.section} ──
                </p>
                {sec.keys.map((k) => (
                  <div
                    key={k.key}
                    className="help-row"
                  >
                    <code className="help-key">{k.key}</code>
                    <span className="help-desc">{k.desc}</span>
                  </div>
                ))}
              </div>
            ))}

            <p
              style={{
                marginTop: '1rem',
                paddingTop: '0.75rem',
                borderTop: '1px solid var(--card-border)',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.7rem',
                color: 'var(--fg-muted)',
                textAlign: 'center',
                opacity: 0.5,
              }}
            >
              premi ? per chiudere
            </p>
          </div>
        </div>
      )}
    </>
  )
}
