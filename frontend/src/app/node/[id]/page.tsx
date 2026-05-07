'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useParams } from 'next/navigation'
import { useAuth } from '@/lib/auth'
import NodeView from '@/components/NodeView'
import Navbar from '@/components/Navbar'

export default function NodePage() {
  const router = useRouter()
  const params = useParams()
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
      <NodeView nodeId={params.id as string} onBack={() => router.push('/tree')} />
    </>
  )
}
