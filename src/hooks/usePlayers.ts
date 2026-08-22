import { useCallback, useEffect, useRef, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { addPlayer, archivePlayer, listPlayers } from '../api/players'
import type { Player } from '../types'

export function usePlayers() {
  const [players, setPlayers] = useState<Player[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refetch = useCallback(async () => {
    setLoading(true)
    try {
      setPlayers(await listPlayers())
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

  const refetchRef = useRef(refetch)
  refetchRef.current = refetch

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout> | null = null
    const scheduleRefetch = () => {
      if (timeout) clearTimeout(timeout)
      timeout = setTimeout(() => refetchRef.current(), 150)
    }

    const channel = supabase
      .channel(`players-list-${Math.random()}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'players' }, scheduleRefetch)
      .subscribe()

    return () => {
      if (timeout) clearTimeout(timeout)
      supabase.removeChannel(channel)
    }
  }, [])

  const add = useCallback(
    async (name: string) => {
      const player = await addPlayer(name)
      await refetch()
      return player
    },
    [refetch],
  )

  const archive = useCallback(
    async (id: string) => {
      await archivePlayer(id)
      await refetch()
    },
    [refetch],
  )

  return { players, loading, error, add, archive, refetch }
}
