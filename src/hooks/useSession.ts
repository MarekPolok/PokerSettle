import { useCallback, useEffect, useRef, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
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

  const refetchRef = useRef(refetch)
  refetchRef.current = refetch

  useEffect(() => {
    if (!sessionId) return
    let timeout: ReturnType<typeof setTimeout> | null = null
    const scheduleRefetch = () => {
      if (timeout) clearTimeout(timeout)
      timeout = setTimeout(() => refetchRef.current(), 150)
    }

    const channel = supabase
      .channel(`session-${sessionId}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'sessions', filter: `id=eq.${sessionId}` },
        scheduleRefetch,
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'legs', filter: `session_id=eq.${sessionId}` },
        scheduleRefetch,
      )
      .subscribe()

    return () => {
      if (timeout) clearTimeout(timeout)
      supabase.removeChannel(channel)
    }
  }, [sessionId])

  return { session, legsData, loading, error, refetch }
}
