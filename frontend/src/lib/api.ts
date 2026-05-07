const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message)
  }
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  let token: string | null = null
  if (typeof window !== 'undefined') {
    token = localStorage.getItem('token')
  }

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  }
  if (token) headers['Authorization'] = `Bearer ${token}`

  const res = await fetch(`${API_URL}${path}`, { ...options, headers })

  if (!res.ok) {
    if (res.status === 401 && typeof window !== 'undefined') {
      localStorage.removeItem('token')
      localStorage.removeItem('username')
    }
    const body = await res.json().catch(() => ({ detail: res.statusText }))
    throw new ApiError(res.status, body.detail || 'Errore sconosciuto')
  }

  return res.json()
}

export const api = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, body: unknown) =>
    request<T>(path, { method: 'POST', body: JSON.stringify(body) }),
}

export interface AuthResponse {
  token: string
  username: string
}

export interface ExerciseData {
  exercise_id: string
  question: string
  hints: string[]
  node_id: string
  level: number
}

export interface ValidationResult {
  correct: boolean
  expected: string
}

export interface SkillNode {
  id: string
  label: string
  description: string
  category: string
}

export interface SkillEdge {
  from: string
  to: string
}

export interface SkillTreeData {
  nodes: SkillNode[]
  edges: SkillEdge[]
}

export interface ProgressData {
  [nodeId: string]: {
    [level: string]: { score: number; completed: boolean }
  }
}
