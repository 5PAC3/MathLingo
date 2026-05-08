'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth'
import PlacementTest from '@/components/PlacementTest'
import Navbar from '@/components/Navbar'

export default function PlacementPage() {
  const router = useRouter()
  const { user, placement_done, loading } = useAuth()
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  useEffect(() => {
    if (mounted && !loading && !user) router.push('/login')
  }, [mounted, loading, user, router])

  useEffect(() => {
    if (mounted && !loading && user && placement_done) router.push('/tree')
  }, [mounted, loading, user, placement_done, router])

  if (!mounted || loading || !user || placement_done) {
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
      <PlacementTest />
    </>
  )
}
