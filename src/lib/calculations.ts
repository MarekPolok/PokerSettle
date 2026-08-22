import type { LegParticipantWithPlayer } from '../api/legs'
import type { BuyIn, CashOut, Leg } from '../types'

export function round2(n: number): number {
  return Math.round(n * 100) / 100
}

export function sumBuyIns(buyIns: BuyIn[], playerId?: string): number {
  return round2(
    buyIns
      .filter((b) => playerId === undefined || b.player_id === playerId)
      .reduce((sum, b) => sum + b.amount, 0),
  )
}

export function sumChips(cashOuts: CashOut[]): number {
  return round2(cashOuts.reduce((sum, c) => sum + c.chip_amount, 0))
}

export interface ReconciliationStatus {
  totalBuyIns: number
  totalChips: number
  diff: number // totalChips - totalBuyIns; negative = chips short (brakuje), positive = surplus (nadwyżka)
  matches: boolean
}

export function reconciliationStatus(buyIns: BuyIn[], cashOuts: CashOut[]): ReconciliationStatus {
  const totalBuyIns = sumBuyIns(buyIns)
  const totalChips = sumChips(cashOuts)
  const diff = round2(totalChips - totalBuyIns)
  return { totalBuyIns, totalChips, diff, matches: diff === 0 }
}

export interface LegDetail {
  leg: Leg
  participants: LegParticipantWithPlayer[]
  buyIns: BuyIn[]
  cashOuts: CashOut[]
}

export interface SessionSummaryRow {
  playerId: string
  playerName: string
  legNets: (number | null)[] // one entry per leg, in leg order; null = no cash-out recorded yet
  totalNet: number
}

export function sessionSummary(legsData: LegDetail[]): { potTotal: number; rows: SessionSummaryRow[] } {
  const potTotal = round2(legsData.reduce((sum, l) => sum + sumBuyIns(l.buyIns), 0))

  const playerMap = new Map<string, { name: string; legNets: (number | null)[] }>()

  legsData.forEach((legData, legIndex) => {
    legData.participants.forEach(({ playerId, player }) => {
      if (!playerMap.has(playerId)) {
        playerMap.set(playerId, { name: player.name, legNets: legsData.map(() => null) })
      }
      const cashOut = legData.cashOuts.find((c) => c.player_id === playerId)
      const buyInTotal = sumBuyIns(legData.buyIns, playerId)
      const net = cashOut ? round2(cashOut.chip_amount - buyInTotal) : null
      playerMap.get(playerId)!.legNets[legIndex] = net
    })
  })

  const rows: SessionSummaryRow[] = Array.from(playerMap.entries()).map(([playerId, { name, legNets }]) => ({
    playerId,
    playerName: name,
    legNets,
    totalNet: round2(legNets.reduce((sum: number, n) => sum + (n ?? 0), 0)),
  }))

  rows.sort((a, b) => b.totalNet - a.totalNet)

  return { potTotal, rows }
}
