import { supabase } from '../lib/supabaseClient'
import type { BuyIn } from '../types'

export async function listBuyInsForLeg(legId: string): Promise<BuyIn[]> {
  const { data, error } = await supabase
    .from('buy_ins')
    .select('*')
    .eq('leg_id', legId)
    .order('created_at', { ascending: true })

  if (error) throw error
  return data
}

export async function addBuyIn(legId: string, playerId: string, amount: number): Promise<BuyIn> {
  const { data, error } = await supabase
    .from('buy_ins')
    .insert({ leg_id: legId, player_id: playerId, amount })
    .select()
    .single()

  if (error) throw error
  return data
}

export async function updateBuyIn(id: string, amount: number): Promise<void> {
  const { error } = await supabase.from('buy_ins').update({ amount }).eq('id', id)
  if (error) throw error
}

export async function deleteBuyIn(id: string): Promise<void> {
  const { error } = await supabase.from('buy_ins').delete().eq('id', id)
  if (error) throw error
}
