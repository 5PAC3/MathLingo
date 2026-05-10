'use client'

import { useEffect, useState, useMemo } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useAuth } from '@/lib/auth'
import { useI18n } from '@/lib/i18n'
import { api, type SkillTreeData, type ProgressData, type SkillNode, type SkillEdge } from '@/lib/api'
import SkillTree from '@/components/SkillTree'
import Navbar from '@/components/Navbar'

export default function MacroPage() {
  const { t } = useI18n()
  const router = useRouter()
  const params = useParams()
  const macro = params.macro as string
  const { user, placement_done, loading } = useAuth()
  const [mounted, setMounted] = useState(false)
  const [tree, setTree] = useState<SkillTreeData | null>(null)
  const [progress, setProgress] = useState<ProgressData>({})

  useEffect(() => { setMounted(true) }, [])

  useEffect(() => {
    api.get<SkillTreeData>('/skilltree').then(setTree).catch(() => console.error('Failed to fetch skilltree'))
  }, [])

  useEffect(() => {
    if (tree && user) {
      api.get<ProgressData>('/progress').then(setProgress).catch(() => {})
    }
  }, [tree, user])

  useEffect(() => {
    if (mounted && !loading && !user) router.push('/login')
  }, [mounted, loading, user, router])

  useEffect(() => {
    if (mounted && !loading && user && !placement_done) router.push('/placement')
  }, [mounted, loading, user, placement_done, router])

  const macroInfo = tree?.macros?.find(m => m.id === macro)

  const filtered = useMemo(() => {
    if (!tree) return null
    const nodeIds = new Set(
      tree.nodes.filter(n => n.category === macro).map(n => n.id)
    )
    const nodes: SkillNode[] = tree.nodes.filter(n => nodeIds.has(n.id))
    const edges: SkillEdge[] = tree.edges.filter(
      e => nodeIds.has(e.from) && nodeIds.has(e.to)
    )
    return { nodes, edges }
  }, [tree, macro])

  if (!mounted || loading || !user || !tree || !filtered || !macroInfo) {
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
        <button
          className="btn btn-sm btn-ghost"
          onClick={() => router.push('/tree')}
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.82rem',
            marginTop: '0.75rem',
            marginBottom: '0.25rem',
          }}
        >
          {t('btn.back_to_overview')}
        </button>
        <SkillTree
          nodes={filtered.nodes}
          edges={filtered.edges}
          progress={progress}
          onNodeClick={nodeId => router.push(`/node/${nodeId}`)}
        />
      </div>
    </>
  )
}
