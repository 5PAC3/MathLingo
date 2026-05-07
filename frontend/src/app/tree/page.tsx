'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth'
import SkillTree from '@/components/SkillTree'

export default function TreePage() {
  const router = useRouter()
  const { user, loading } = useAuth()
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  if (!mounted || loading) return <p className="container text-center text-muted">Caricamento...</p>

  if (!user) {
    router.push('/login')
    return null
  }

  return (
    <div className="container">
      <div className="flex items-center justify-between mb-2">
        <h1 style={{ fontSize: '1.5rem' }}>Skill Tree</h1>
        <div className="flex items-center gap-2">
          <span className="text-muted" style={{ fontSize: '0.9rem' }}>{user.username}</span>
          <button
            className="btn btn-sm btn-outline"
            onClick={() => router.push('/login')}
          >
            Esci
          </button>
        </div>
      </div>
      <SkillTree onNodeClick={nodeId => router.push(`/node/${nodeId}`)} />
    </div>
  )
}
