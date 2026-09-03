import { supabase } from '../lib/supabaseClient'
import type { Player } from '../types'

export async function listPlayers(): Promise<Player[]> {
  const { data, error } = await supabase
    .from('players')
    .select('*')
    .order('name', { ascending: true })

  if (error) throw error
  return data
}

export async function getPlayer(id: string): Promise<Player> {
  const { data, error } = await supabase.from('players').select('*').eq('id', id).single()

  if (error) throw error
  return data
}

export async function addPlayer(name: string): Promise<Player> {
  const { data, error } = await supabase
    .from('players')
    .insert({ name })
    .select()
    .single()

  if (error) throw error
  return data
}

export async function archivePlayer(id: string): Promise<void> {
  const { error } = await supabase
    .from('players')
    .update({ is_archived: true })
    .eq('id', id)

  if (error) throw error
}
