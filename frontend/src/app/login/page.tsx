'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth'
import LoginForm from '@/components/LoginForm'

export default function LoginPage() {
  const router = useRouter()
  const { user, placement_done, loading } = useAuth()

  useEffect(() => {
    if (!loading && user) {
      router.push(placement_done ? '/tree' : '/placement')
    }
  }, [loading, user, placement_done, router])

  if (loading || user) return null

  return <LoginForm onSuccess={() => {
    const pd = localStorage.getItem('placement_done')
    router.push(pd === 'false' ? '/placement' : '/tree')
  }} />
}
