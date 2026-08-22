import { useCallback, useEffect, useState } from 'react'
import { addLegParticipants, getLeg, getLegParticipants, reconcileLeg as reconcileLegApi } from '../api/legs'
import type { LegParticipantWithPlayer } from '../api/legs'
import { addBuyIn, deleteBuyIn, listBuyInsForLeg, updateBuyIn } from '../api/buyIns'
import { listCashOutsForLeg, upsertCashOut } from '../api/cashOuts'
import type { BuyIn, CashOut, Leg } from '../types'

export function useLeg(legId: string | undefined) {
  const [leg, setLeg] = useState<Leg | null>(null)
  const [participants, setParticipants] = useState<LegParticipantWithPlayer[]>([])
  const [buyIns, setBuyIns] = useState<BuyIn[]>([])
  const [cashOuts, setCashOuts] = useState<CashOut[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refetch = useCallback(async () => {
    if (!legId) return
    setLoading(true)
    try {
      const [legData, participantsData, buyInsData, cashOutsData] = await Promise.all([
        getLeg(legId),
        getLegParticipants(legId),
        listBuyInsForLeg(legId),
        listCashOutsForLeg(legId),
      ])
      setLeg(legData)
      setParticipants(participantsData)
      setBuyIns(buyInsData)
      setCashOuts(cashOutsData)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err))
    } finally {
      setLoading(false)
    }
  }, [legId])

  useEffect(() => {
    refetch()
  }, [refetch])

  const logBuyIn = useCallback(
    async (playerId: string, amount: number) => {
      if (!legId) return
      await addBuyIn(legId, playerId, amount)
      await refetch()
    },
    [legId, refetch],
  )

  const editBuyIn = useCallback(
    async (id: string, amount: number) => {
      await updateBuyIn(id, amount)
      await refetch()
    },
    [refetch],
  )

  const removeBuyIn = useCallback(
    async (id: string) => {
      await deleteBuyIn(id)
      await refetch()
    },
    [refetch],
  )

  const addParticipants = useCallback(
    async (playerIds: string[]) => {
      if (!legId) return
      await addLegParticipants(legId, playerIds)
      await refetch()
    },
    [legId, refetch],
  )

  const setChipCount = useCallback(
    async (playerId: string, chipAmount: number) => {
      if (!legId) return
      await upsertCashOut(legId, playerId, chipAmount)
      await refetch()
    },
    [legId, refetch],
  )

  const reconcile = useCallback(async () => {
    if (!legId) return
    await reconcileLegApi(legId)
    await refetch()
  }, [legId, refetch])

  return {
    leg,
    participants,
    buyIns,
    cashOuts,
    loading,
    error,
    refetch,
    logBuyIn,
    editBuyIn,
    removeBuyIn,
    addParticipants,
    setChipCount,
    reconcile,
  }
}
