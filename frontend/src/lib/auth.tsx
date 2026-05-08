'use client'

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react'
import { api, type AuthResponse, type UserInfo } from './api'

interface AuthContextType {
  user: { username: string } | null
  token: string | null
  placement_done: boolean
  login: (username: string, password: string) => Promise<void>
  register: (username: string, password: string) => Promise<void>
  logout: () => void
  loading: boolean
  refreshPlacement: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<{ username: string } | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [placementDone, setPlacementDone] = useState(true)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const storedToken = localStorage.getItem('token')
    const storedUser = localStorage.getItem('username')
    const storedPlacement = localStorage.getItem('placement_done')
    if (storedToken && storedUser) {
      setToken(storedToken)
      setUser({ username: storedUser })
      if (storedPlacement !== null) {
        setPlacementDone(storedPlacement === 'true')
      }
      api.get<UserInfo>('/auth/me').then(info => {
        setPlacementDone(info.placement_done)
        localStorage.setItem('placement_done', String(info.placement_done))
      }).catch(() => {
        setToken(null)
        setUser(null)
        localStorage.removeItem('token')
        localStorage.removeItem('username')
        localStorage.removeItem('placement_done')
      })
    }
    setLoading(false)
  }, [])

  const handleAuth = (res: AuthResponse) => {
    localStorage.setItem('token', res.token)
    localStorage.setItem('username', res.username)
    localStorage.setItem('placement_done', String(res.placement_done))
    setToken(res.token)
    setUser({ username: res.username })
    setPlacementDone(res.placement_done)
  }

  const login = useCallback(async (username: string, password: string) => {
    const res = await api.post<AuthResponse>('/auth/login', { username, password })
    handleAuth(res)
  }, [])

  const register = useCallback(async (username: string, password: string) => {
    const res = await api.post<AuthResponse>('/auth/register', { username, password })
    handleAuth(res)
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem('token')
    localStorage.removeItem('username')
    localStorage.removeItem('placement_done')
    setToken(null)
    setUser(null)
    setPlacementDone(true)
  }, [])

  const refreshPlacement = useCallback(async () => {
    try {
      const info = await api.get<UserInfo>('/auth/me')
      setPlacementDone(info.placement_done)
      localStorage.setItem('placement_done', String(info.placement_done))
    } catch {
      /* silent */
    }
  }, [])

  return (
    <AuthContext.Provider value={{ user, token, placement_done: placementDone, login, register, logout, loading, refreshPlacement }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
