'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth'
import LoginForm from '@/components/LoginForm'

export default function LoginPage() {
  const router = useRouter()
  const { user, loading } = useAuth()

  useEffect(() => {
    if (!loading && user) router.push('/tree')
  }, [loading, user, router])

  if (loading || user) return null

  return <LoginForm onSuccess={() => router.push('/tree')} />
}
