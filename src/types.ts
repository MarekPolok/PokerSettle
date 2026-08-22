// Mirrors the Supabase/Postgres schema 1:1. Keep field names/types in sync with the SQL migration.

export type SessionStatus = 'in_progress' | 'completed'
export type LegStatus = 'in_progress' | 'reconciled'

export interface Player {
  id: string
  name: string
  is_archived: boolean
  created_at: string
}

export interface Session {
  id: string
  name: string
  status: SessionStatus
  created_at: string
  completed_at: string | null
}

export interface Leg {
  id: string
  session_id: string
  label: string
  leg_order: 1 | 2
  status: LegStatus
  created_at: string
  reconciled_at: string | null
}

export interface LegParticipant {
  id: string
  leg_id: string
  player_id: string
}

export interface BuyIn {
  id: string
  leg_id: string
  player_id: string
  amount: number
  created_at: string
}

export interface CashOut {
  id: string
  leg_id: string
  player_id: string
  chip_amount: number
  recorded_at: string
}

// Derived / computed values (not stored, calculated in src/lib/calculations.ts)

export interface LegTotals {
  totalBuyIns: number
  totalChips: number
  diff: number // totalChips - totalBuyIns; 0 means reconciled
}

export interface PlayerLegNet {
  playerId: string
  buyInTotal: number
  chipAmount: number | null
  net: number | null // null if no cash-out recorded yet
}

export interface PlayerSessionNet {
  playerId: string
  legNets: Record<string, number | null> // legId -> net
  totalNet: number
}

export interface PlayerRanking {
  playerId: string
  playerName: string
  totalNet: number
  sessionsPlayed: number
  avgPerSession: number
  rank: number
}
