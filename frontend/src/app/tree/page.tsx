'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth'
import SkillTree from '@/components/SkillTree'
import Navbar from '@/components/Navbar'

export default function TreePage() {
  const router = useRouter()
  const { user, loading } = useAuth()
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  useEffect(() => {
    if (mounted && !loading && !user) router.push('/login')
  }, [mounted, loading, user, router])

  if (!mounted || loading || !user) {
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
          Skill Tree
        </h1>
        <p className="text-muted mb-2" style={{ fontSize: '0.9rem' }}>
          Scegli un argomento per iniziare
        </p>
        <SkillTree onNodeClick={nodeId => router.push(`/node/${nodeId}`)} />
      </div>
    </>
  )
}
