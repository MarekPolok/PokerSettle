import { supabase } from '../lib/supabaseClient'
import type { CashOut } from '../types'

export async function listCashOutsForLeg(legId: string): Promise<CashOut[]> {
  const { data, error } = await supabase.from('cash_outs').select('*').eq('leg_id', legId)
  if (error) throw error
  return data
}

export async function upsertCashOut(legId: string, playerId: string, chipAmount: number): Promise<void> {
  const { error } = await supabase
    .from('cash_outs')
    .upsert({ leg_id: legId, player_id: playerId, chip_amount: chipAmount }, { onConflict: 'leg_id,player_id' })

  if (error) throw error
}
