'use client'

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react'
import { api, type AuthResponse } from './api'

interface AuthContextType {
  user: { username: string } | null
  token: string | null
  login: (username: string, password: string) => Promise<void>
  register: (username: string, password: string) => Promise<void>
  logout: () => void
  loading: boolean
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<{ username: string } | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const storedToken = localStorage.getItem('token')
    const storedUser = localStorage.getItem('username')
    if (storedToken && storedUser) {
      setToken(storedToken)
      setUser({ username: storedUser })
    }
    setLoading(false)
  }, [])

  const handleAuth = (res: AuthResponse) => {
    localStorage.setItem('token', res.token)
    localStorage.setItem('username', res.username)
    setToken(res.token)
    setUser({ username: res.username })
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
    setToken(null)
    setUser(null)
  }, [])

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
