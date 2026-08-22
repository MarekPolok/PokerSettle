import { useCallback, useEffect, useState } from 'react'
import { getSessionPotTotal, listSessions } from '../api/sessions'
import type { Session } from '../types'

export interface SessionListEntry extends Session {
  potTotal: number | null // null while loading, or not applicable (in-progress sessions)
}

export function useSessions() {
  const [sessions, setSessions] = useState<SessionListEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refetch = useCallback(async () => {
    setLoading(true)
    try {
      const list = await listSessions()
      setSessions(list.map((s) => ({ ...s, potTotal: null })))
      setError(null)

      const completed = list.filter((s) => s.status === 'completed')
      const pots = await Promise.all(completed.map((s) => getSessionPotTotal(s.id)))
      const potById = new Map(completed.map((s, i) => [s.id, pots[i]]))
      setSessions((prev) => prev.map((s) => (potById.has(s.id) ? { ...s, potTotal: potById.get(s.id)! } : s)))
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err))
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    refetch()
  }, [refetch])

  return { sessions, loading, error, refetch }
}
