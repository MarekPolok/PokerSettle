import { useCallback, useEffect, useState } from 'react'
import { getFullSession } from '../api/sessions'
import type { LegDetail } from '../lib/calculations'
import type { Session } from '../types'

export function useSession(sessionId: string | undefined) {
  const [session, setSession] = useState<Session | null>(null)
  const [legsData, setLegsData] = useState<LegDetail[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refetch = useCallback(async () => {
    if (!sessionId) return
    setLoading(true)
    try {
      const { session, legsData } = await getFullSession(sessionId)
      setSession(session)
      setLegsData(legsData)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err))
    } finally {
      setLoading(false)
    }
  }, [sessionId])

  useEffect(() => {
    refetch()
  }, [refetch])

  return { session, legsData, loading, error, refetch }
}
