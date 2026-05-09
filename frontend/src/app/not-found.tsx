'use client'

import { useMemo, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import katex from 'katex'
import { useI18n } from '@/lib/i18n'

const MEME_KEYS = [
  '404.meme.0', '404.meme.1', '404.meme.2', '404.meme.3',
  '404.meme.4', '404.meme.5', '404.meme.6', '404.meme.7',
  '404.meme.8', '404.meme.9', '404.meme.10', '404.meme.11',
]

export default function NotFound() {
  const { t } = useI18n()
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  const memeText = useMemo(() => {
    if (!mounted) return { text: '404', equation: '404' }
    const key = MEME_KEYS[Math.floor(Math.random() * MEME_KEYS.length)]
    const text = t(key)
    const eqs = [
      '\\lim_{x \\to 404} \\text{pagina}(x) = \\nexists',
      '\\frac{\\partial}{\\partial x} \\text{trovata} = 0',
      '\\int_{0}^{\\infty} \\text{pagina} \\, dx = 404',
      '\\sqrt{-1} = \\text{pagina}',
      'e^{i\\pi} + 1 = 0 \\implies \\text{pagina} = \\nexists',
    ]
    const eq = eqs[Math.floor(Math.random() * eqs.length)]
    try {
      const rendered = katex.renderToString(eq, { throwOnError: false, displayMode: true })
      return { text, equation: rendered }
    } catch {
      return { text, equation: eq }
    }
  }, [mounted, t])

  return (
    <div
      className="container"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '70vh',
        textAlign: 'center',
        padding: '2rem 1rem',
      }}
    >
      {mounted ? (
        <>
          <div
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.9rem',
              lineHeight: 1.6,
              color: 'var(--fg-muted)',
              maxWidth: 400,
              marginBottom: '2rem',
            }}
          >
            <div dangerouslySetInnerHTML={{ __html: memeText.equation }} />
            <p style={{ marginTop: '1rem' }}>{memeText.text}</p>
          </div>
        </>
      ) : (
        <div
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '4rem',
            fontWeight: 800,
            color: 'var(--primary)',
            marginBottom: '1rem',
          }}
        >
          404
        </div>
      )}

      <div className="flex items-center gap-2" style={{ flexWrap: 'wrap', justifyContent: 'center' }}>
        <button className="btn" onClick={() => router.push('/tree')}>
          {t('btn.back_to_tree')}
        </button>
        <button className="btn btn-ghost" onClick={() => router.push('/login')}>
          {t('btn.login_link')}
        </button>
      </div>
    </div>
  )
}
