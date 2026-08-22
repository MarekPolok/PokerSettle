import type { BuyIn, CashOut } from '../types'

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
