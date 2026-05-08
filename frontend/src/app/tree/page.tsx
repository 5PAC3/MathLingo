'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth'
import { api, type SkillTreeData, type ProgressData } from '@/lib/api'
import MacroTree from '@/components/MacroTree'
import Navbar from '@/components/Navbar'

export default function TreePage() {
  const router = useRouter()
  const { user, loading } = useAuth()
  const [mounted, setMounted] = useState(false)
  const [tree, setTree] = useState<SkillTreeData | null>(null)
  const [progress, setProgress] = useState<ProgressData>({})

  useEffect(() => { setMounted(true) }, [])

  useEffect(() => {
    api.get<SkillTreeData>('/skilltree').then(setTree)
  }, [])

  useEffect(() => {
    if (tree && user) {
      api.get<ProgressData>('/progress').then(setProgress).catch(() => {})
    }
  }, [tree, user])

  useEffect(() => {
    if (mounted && !loading && !user) router.push('/login')
  }, [mounted, loading, user, router])

  if (!mounted || loading || !user || !tree) {
    return (
      <>
        <Navbar />
        <div className="container">
          <div className="spinner" />
        </div>
      </>
    )
  }

  return (
    <>
      <Navbar />
      <div className="container">
        <h1
          style={{
            fontSize: '1.3rem',
            fontWeight: 800,
            marginTop: '0.5rem',
            marginBottom: '0.25rem',
          }}
        >
          Panoramica
        </h1>
        <p className="text-muted mb-2" style={{ fontSize: '0.9rem' }}>
          Scegli un macro-argomento per iniziare
        </p>
        <MacroTree
          macros={tree?.macros ?? []}
          nodes={tree?.nodes ?? []}
          progress={progress}
          onMacroClick={macroId => router.push(`/tree/${macroId}`)}
        />
      </div>
    </>
  )
}
