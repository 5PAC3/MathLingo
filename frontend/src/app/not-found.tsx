'use client'

import { useMemo } from 'react'
import Link from 'next/link'
import katex from 'katex'
import Navbar from '@/components/Navbar'

const MEMES = [
  { msg: 'Questa pagina \u00e8 stata derivata e non esiste pi\u00f9.', eq: '\\frac{d}{dx}(404) = 0' },
  { msg: 'Hai sbagliato i conti. Riprova.', eq: '404 \\neq 200' },
  { msg: 'Pagina = undefined. Hai dimenticato di dichiarare la variabile.', eq: '\\text{pagina} = \\text{undefined}' },
  { msg: 'Questa pagina \u00e8 un numero immaginario. Non la troverai mai.', eq: '\\sqrt{-404} = 20.1i' },
  { msg: 'La pagina cercata tende a \u221e. Non arriverai mai.', eq: '\\lim_{x \\to \\infty} \\text{pagina}(x) = \\infty' },
  { msg: 'Come una divisione per zero.', eq: '\\frac{404}{0} = \\text{undefined}' },
  { msg: 'Questa pagina \u00e8 asintotica. Si avvicina ma non esiste.', eq: '\\lim_{x \\to 404} f(x) = \\nexists' },
  { msg: 'Pagina al quadrato = -1. Soluzione immaginaria.', eq: 'x^2 = -1 \\implies x = \\pm i' },
  { msg: 'La pagina \u00e8 stata sottratta dal server.', eq: '404 - 404 = 0' },
  { msg: 'Teorema: La pagina non esiste. Dimostrazione: per assurdo...', eq: '\\bot \\implies \\lnot \\exists \\text{pagina}' },
  { msg: 'ERRORE: Pagina fuori dal dominio.', eq: 'x \\notin \\text{dom}(f)' },
  { msg: 'Questa pagina ha fatto overflow.', eq: '\\text{pagina} = \\text{INT\\_MAX} + 1' },
]

function renderEq(eq: string): string {
  try {
    return katex.renderToString(eq, { throwOnError: false, displayMode: true })
  } catch {
    return eq
  }
}

export default function NotFound() {
  const idx = useMemo(() => Math.floor(Math.random() * MEMES.length), [])
  const meme = MEMES[idx]

  const eqHtml = useMemo(() => renderEq(meme.eq), [meme.eq])

  return (
    <>
      <Navbar />
      <div className="container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 'calc(100vh - 6rem)', textAlign: 'center' }}>
        <div
          className="card double-border"
          style={{
            maxWidth: 520,
            width: '100%',
            padding: '2rem',
          }}
        >
          <h1
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '5rem',
              fontWeight: 700,
              lineHeight: 1,
              color: 'var(--primary)',
              letterSpacing: '-0.06em',
              marginBottom: '0.75rem',
            }}
          >
            404
          </h1>

          <p
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.85rem',
              color: 'var(--fg-muted)',
              lineHeight: 1.6,
              marginBottom: '1.25rem',
              padding: '0.75rem',
              background: 'var(--bg-alt)',
              borderRadius: 'var(--radius-sm)',
            }}
          >
            {meme.msg}
          </p>

          <div
            style={{
              marginBottom: '1.5rem',
              padding: '0.5rem 0',
              opacity: 0.7,
            }}
            dangerouslySetInnerHTML={{ __html: eqHtml }}
          />

          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/tree" className="btn" style={{ textDecoration: 'none' }}>
              Torna allo Skill Tree
            </Link>
            <Link href="/login" className="btn btn-outline" style={{ textDecoration: 'none' }}>
              Accedi
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}
