'use client'

import { useEffect, useRef } from 'react'

export type KeyMap = Record<string, () => void>

interface HotkeysOptions {
  ignoreWhenInput?: boolean
}

function parseHotkey(key: string): {
  key: string
  ctrl: boolean
  meta: boolean
  shift: boolean
} {
  const parts = key.split('+')
  let ctrl = false
  let meta = false
  let shift = false
  const keyParts = parts.filter((p) => {
    const lower = p.toLowerCase()
    if (lower === 'ctrl') { ctrl = true; return false }
    if (lower === 'meta' || lower === 'cmd') { meta = true; return false }
    if (lower === 'shift') { shift = true; return false }
    return true
  })
  return { key: keyParts[0] || '', ctrl, meta, shift }
}

export function useHotkeys(
  map: KeyMap,
  options?: HotkeysOptions,
) {
  const ignoreWhenInput = options?.ignoreWhenInput ?? true
  const mapRef = useRef(map)
  mapRef.current = map

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement
      const isInput =
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable

      for (const [hotkey, fn] of Object.entries(mapRef.current)) {
        const parsed = parseHotkey(hotkey)
        const keyMatch =
          e.key === parsed.key || e.key.toLowerCase() === parsed.key.toLowerCase()
        const modMatch =
          e.ctrlKey === parsed.ctrl &&
          e.metaKey === parsed.meta &&
          e.shiftKey === parsed.shift

        if (keyMatch && modMatch) {
          if (isInput && ignoreWhenInput) continue
          e.preventDefault()
          fn()
          return
        }
      }
    }

    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [ignoreWhenInput])
}
