import { useCallback, useEffect, useState } from 'react'
import { getSessionWithLegs } from '../api/sessions'
import { getLegParticipants } from '../api/legs'
import { listBuyInsForLeg } from '../api/buyIns'
import { listCashOutsForLeg } from '../api/cashOuts'
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
      const { session, legs } = await getSessionWithLegs(sessionId)
      const details = await Promise.all(
        legs.map(async (leg) => {
          const [participants, buyIns, cashOuts] = await Promise.all([
            getLegParticipants(leg.id),
            listBuyInsForLeg(leg.id),
            listCashOutsForLeg(leg.id),
          ])
          return { leg, participants, buyIns, cashOuts }
        }),
      )
      setSession(session)
      setLegsData(details)
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
