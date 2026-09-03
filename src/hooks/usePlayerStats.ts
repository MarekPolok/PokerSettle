import { useCallback, useEffect, useState } from 'react'
import { getPlayer } from '../api/players'
import { getAllCompletedSessionsData } from '../api/rankings'
import { allTimeRankings, playerSessionHistory } from '../lib/calculations'
import type { Player, PlayerRanking } from '../types'
import type { PlayerSessionHistoryRow } from '../lib/calculations'

export function usePlayerStats(playerId: string | undefined) {
  const [player, setPlayer] = useState<Player | null>(null)
  const [ranking, setRanking] = useState<PlayerRanking | null>(null)
  const [history, setHistory] = useState<PlayerSessionHistoryRow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refetch = useCallback(async () => {
    if (!playerId) return
    setLoading(true)
    try {
      const [playerData, sessionsData] = await Promise.all([getPlayer(playerId), getAllCompletedSessionsData()])
      setPlayer(playerData)
      setRanking(allTimeRankings(sessionsData).find((r) => r.playerId === playerId) ?? null)
      setHistory(playerSessionHistory(playerId, sessionsData))
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err))
    } finally {
      setLoading(false)
    }
  }, [playerId])

  useEffect(() => {
    refetch()
  }, [refetch])

  return { player, ranking, history, loading, error }
}
