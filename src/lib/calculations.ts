import type { BuyIn } from '../types'

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
