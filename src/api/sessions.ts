import { supabase } from '../lib/supabaseClient'
import { addLegParticipants } from './legs'
import type { Leg, Session } from '../types'

export async function createSession(
  name: string,
  participantPlayerIds: string[],
): Promise<{ session: Session; leg: Leg }> {
  const { data: session, error: sessionError } = await supabase
    .from('sessions')
    .insert({ name })
    .select()
    .single()
  if (sessionError) throw sessionError

  const { data: leg, error: legError } = await supabase
    .from('legs')
    .insert({ session_id: session.id, label: 'Tam', leg_order: 1 })
    .select()
    .single()
  if (legError) throw legError

  await addLegParticipants(leg.id, participantPlayerIds)

  return { session, leg }
}
