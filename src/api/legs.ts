import { supabase } from '../lib/supabaseClient'

export async function addLegParticipants(legId: string, playerIds: string[]): Promise<void> {
  if (playerIds.length === 0) return
  const { error } = await supabase
    .from('leg_participants')
    .insert(playerIds.map((player_id) => ({ leg_id: legId, player_id })))

  if (error) throw error
}
