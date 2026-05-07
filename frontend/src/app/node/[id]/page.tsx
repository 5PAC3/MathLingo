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

  if (!mounted || loading) {
    return (
      <>
        <Navbar />
        <div className="container">
          <div className="spinner" />
        </div>
      </>
    )
  }

  if (!user) {
    router.push('/login')
    return null
  }

  return (
    <>
      <Navbar />
      <NodeView nodeId={params.id as string} onBack={() => router.push('/tree')} />
    </>
  )
}
