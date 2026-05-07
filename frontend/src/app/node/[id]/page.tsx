'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useParams } from 'next/navigation'
import { useAuth } from '@/lib/auth'
import NodeView from '@/components/NodeView'

export default function NodePage() {
  const router = useRouter()
  const params = useParams()
  const { user, loading } = useAuth()
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  if (!mounted || loading) return <p className="container text-center text-muted">Caricamento...</p>

  if (!user) {
    router.push('/login')
    return null
  }

  return <NodeView nodeId={params.id as string} onBack={() => router.push('/tree')} />
}
