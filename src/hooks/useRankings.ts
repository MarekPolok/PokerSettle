import { useCallback, useEffect, useState } from 'react'
import { getAllCompletedSessionsData } from '../api/rankings'
import { allTimeRankings } from '../lib/calculations'
import type { PlayerRanking } from '../types'

export function useRankings() {
  const [rankings, setRankings] = useState<PlayerRanking[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refetch = useCallback(async () => {
    setLoading(true)
    try {
      const sessionsData = await getAllCompletedSessionsData()
      setRankings(allTimeRankings(sessionsData))
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err))
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    refetch()
  }, [refetch])

  return { rankings, loading, error, refetch }
}
