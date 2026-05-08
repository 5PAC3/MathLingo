'use client'

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react'
import it from '@/i18n/it.json'
import en from '@/i18n/en.json'

type Lang = 'it' | 'en'
type Translations = Record<string, string>

const BUNDLES: Record<Lang, Translations> = { it, en }

interface I18nContextType {
  lang: Lang
  setLang: (l: Lang) => void
  t: (key: string, vars?: Record<string, string | number>) => string
}

const I18nContext = createContext<I18nContextType | null>(null)

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>('it')

  useEffect(() => {
    const stored = localStorage.getItem('lang') as Lang | null
    if (stored === 'en' || stored === 'it') setLangState(stored)
  }, [])

  const setLang = useCallback((l: Lang) => {
    localStorage.setItem('lang', l)
    setLangState(l)
  }, [])

  const t = useCallback((key: string, vars?: Record<string, string | number>): string => {
    const bundle = BUNDLES[lang]
    let val = bundle[key]
    if (val === undefined) val = BUNDLES.it[key] ?? key
    if (vars) {
      for (const [k, v] of Object.entries(vars)) {
        val = val.replace(`{${k}}`, String(v))
      }
    }
    return val
  }, [lang])

  return (
    <I18nContext.Provider value={{ lang, setLang, t }}>
      {children}
    </I18nContext.Provider>
  )
}

export function useI18n() {
  const ctx = useContext(I18nContext)
  if (!ctx) throw new Error('useI18n must be used within I18nProvider')
  return ctx
}
