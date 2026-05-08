'use client'

import { useState, useEffect, useCallback } from 'react'
import { useHotkeys } from '@/lib/hotkeys'
import { useI18n } from '@/lib/i18n'

export default function KeyboardShortcutsHelp() {
  const { t } = useI18n()
  const [open, setOpen] = useState(false)

  useHotkeys({
    '?': () => setOpen(v => !v),
    'Escape': () => setOpen(false),
  })

  const close = useCallback(() => setOpen(false), [])

  useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [open])

  useEffect(() => {
    const btn = document.getElementById('help-toggle')
    if (btn) btn.style.display = 'block'
  }, [])

  return (
    <>
      <button
        id="help-toggle"
        className="btn btn-sm btn-ghost"
        onClick={() => setOpen(v => !v)}
        aria-label={t('aria.help')}
        title={t('heading.keyboard_shortcuts')}
        style={{
          position: 'fixed',
          bottom: '0.75rem',
          left: '0.75rem',
          zIndex: 50,
          fontFamily: 'var(--font-mono)',
          fontSize: '0.75rem',
          opacity: 0.6,
          display: 'none',
        }}
      >
        {t('help.button')}
      </button>

      {open && (
        <div
          role="dialog"
          aria-label={t('heading.keyboard_shortcuts')}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 100,
            background: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem',
          }}
          onClick={close}
        >
          <div
            className="card"
            onClick={e => e.stopPropagation()}
            style={{
              maxWidth: 480,
              width: '100%',
              maxHeight: '80vh',
              overflowY: 'auto',
              padding: '1.5rem',
            }}
          >
            <h2
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '1rem',
                fontWeight: 700,
                marginTop: 0,
                color: 'var(--fg)',
              }}
            >
              {t('shortcut.dialog_title')}
            </h2>

            <Section title={t('shortcut.section.global')}>
              <Row keys="?" desc={t('shortcut.toggle_help')} />
              <Row keys={t('key_hint.Escape')} desc={t('shortcut.close_back')} />
            </Section>

            <Section title={t('shortcut.section.tree')}>
              <Row keys="↑↓←→" desc={t('shortcut.navigate_nodes')} />
              <Row keys={t('key_hint.Enter')} desc={t('shortcut.open_node')} />
            </Section>

            <Section title={t('shortcut.section.theory')}>
              <Row keys={t('key_hint.e')} desc={t('shortcut.go_to_exercises')} />
              <Row keys={t('key_hint.Escape')} desc={t('shortcut.back_to_tree')} />
            </Section>

            <Section title={t('shortcut.section.exercises')}>
              <Row keys={t('key_hint.t')} desc={t('shortcut.back_to_theory')} />
              <Row keys={`${t('key_hint.1')} ${t('key_hint.2')} ${t('key_hint.3')}`} desc={t('shortcut.select_level')} />
              <Row keys={t('key_hint.n')} desc={t('shortcut.new_exercise')} />
              <Row keys={t('key_hint.h')} desc={t('shortcut.hints')} />
              <Row keys={t('key_hint.Enter')} desc={t('shortcut.submit')} />
              <Row keys={t('key_hint.ctrl_enter')} desc={t('shortcut.submit_ctrl')} />
              <Row keys={t('key_hint.Escape')} desc={t('shortcut.back_to_tree')} />
            </Section>

            <p
              style={{
                textAlign: 'center',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.72rem',
                color: 'var(--fg-muted)',
                marginTop: '1rem',
                marginBottom: 0,
              }}
            >
              {t('shortcut.dialog_hint')}
            </p>
          </div>
        </div>
      )}
    </>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginTop: '1rem' }}>
      <h3
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '0.8rem',
          fontWeight: 600,
          color: 'var(--primary)',
          margin: '0 0 0.4rem',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
        }}
      >
        {title}
      </h3>
      {children}
    </div>
  )
}

function Row({ keys, desc }: { keys: string; desc: string }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        padding: '0.25rem 0',
      }}
    >
      <kbd
        style={{
          fontFamily: 'var(--font-mono)',
          background: 'var(--bg-alt)',
          border: '1px solid var(--card-border)',
          borderRadius: 4,
          padding: '0.15rem 0.5rem',
          fontSize: '0.75rem',
          fontWeight: 600,
          color: 'var(--fg)',
          minWidth: 32,
          textAlign: 'center',
          whiteSpace: 'nowrap',
        }}
      >
        {keys}
      </kbd>
      <span
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '0.78rem',
          color: 'var(--fg)',
        }}
      >
        {desc}
      </span>
    </div>
  )
}
