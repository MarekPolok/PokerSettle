import { supabase } from '../lib/supabaseClient'
import type { Leg, Player } from '../types'

export interface LegParticipantWithPlayer {
  playerId: string
  player: Player
}

export async function getLeg(legId: string): Promise<Leg> {
  const { data, error } = await supabase.from('legs').select('*').eq('id', legId).single()
  if (error) throw error
  return data
}

export async function getLegParticipants(legId: string): Promise<LegParticipantWithPlayer[]> {
  const { data, error } = await supabase
    .from('leg_participants')
    .select('player_id, players(*)')
    .eq('leg_id', legId)

  if (error) throw error
  return (data ?? []).map((row) => ({
    playerId: row.player_id,
    player: row.players as unknown as Player,
  }))
}

export async function addLegParticipants(legId: string, playerIds: string[]): Promise<void> {
  if (playerIds.length === 0) return
  const { error } = await supabase
    .from('leg_participants')
    .insert(playerIds.map((player_id) => ({ leg_id: legId, player_id })))

  if (error) throw error
}
