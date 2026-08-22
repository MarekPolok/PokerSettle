import { supabase } from '../lib/supabaseClient'
import { getFullSession } from './sessions'
import type { LegDetail } from '../lib/calculations'
import type { Session } from '../types'

export async function getAllCompletedSessionsData(): Promise<{ session: Session; legsData: LegDetail[] }[]> {
  const { data, error } = await supabase.from('sessions').select('id').eq('status', 'completed')
  if (error) throw error

  return Promise.all((data ?? []).map((s) => getFullSession(s.id)))
}
