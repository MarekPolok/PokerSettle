import type { LegParticipantWithPlayer } from '../api/legs'
import type { BuyIn, CashOut, Leg, PlayerRanking, Session } from '../types'

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

export function allTimeRankings(sessionsData: { legsData: LegDetail[] }[]): PlayerRanking[] {
  const stats = new Map<string, { name: string; totalNet: number; sessionsPlayed: number }>()

  sessionsData.forEach(({ legsData }) => {
    const { rows } = sessionSummary(legsData)
    rows.forEach((row) => {
      const existing = stats.get(row.playerId) ?? { name: row.playerName, totalNet: 0, sessionsPlayed: 0 }
      existing.totalNet = round2(existing.totalNet + row.totalNet)
      existing.sessionsPlayed += 1
      stats.set(row.playerId, existing)
    })
  })

  const list: PlayerRanking[] = Array.from(stats.entries()).map(([playerId, s]) => ({
    playerId,
    playerName: s.name,
    totalNet: s.totalNet,
    sessionsPlayed: s.sessionsPlayed,
    avgPerSession: round2(s.totalNet / s.sessionsPlayed),
    rank: 0,
  }))

  // Sort by net desc; alphabetical is only a display tiebreaker within equal-net groups.
  list.sort((a, b) => b.totalNet - a.totalNet || a.playerName.localeCompare(b.playerName, 'pl'))

  // Standard competition ranking: ties share a rank, the next distinct value skips ahead (1,1,3).
  let rank = 0
  list.forEach((row, i) => {
    if (i === 0 || row.totalNet !== list[i - 1].totalNet) {
      rank = i + 1
    }
    row.rank = rank
  })

  return list
}

export interface PlayerSessionHistoryRow {
  sessionId: string
  sessionName: string
  completedAt: string | null
  net: number
}

export function playerSessionHistory(
  playerId: string,
  sessionsData: { session: Session; legsData: LegDetail[] }[],
): PlayerSessionHistoryRow[] {
  const rows = sessionsData
    .map(({ session, legsData }) => {
      const row = sessionSummary(legsData).rows.find((r) => r.playerId === playerId)
      if (!row) return null
      return { sessionId: session.id, sessionName: session.name, completedAt: session.completed_at, net: row.totalNet }
    })
    .filter((row): row is PlayerSessionHistoryRow => row !== null)

  rows.sort((a, b) => (b.completedAt ?? '').localeCompare(a.completedAt ?? ''))

  return rows
}
