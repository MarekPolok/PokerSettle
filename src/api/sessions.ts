import { supabase } from '../lib/supabaseClient'
import { addLegParticipants, reopenLeg } from './legs'
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

export async function getSessionWithLegs(sessionId: string): Promise<{ session: Session; legs: Leg[] }> {
  const [sessionRes, legsRes] = await Promise.all([
    supabase.from('sessions').select('*').eq('id', sessionId).single(),
    supabase.from('legs').select('*').eq('session_id', sessionId).order('leg_order', { ascending: true }),
  ])
  if (sessionRes.error) throw sessionRes.error
  if (legsRes.error) throw legsRes.error
  return { session: sessionRes.data, legs: legsRes.data }
}

export async function completeSession(sessionId: string): Promise<void> {
  const { error } = await supabase
    .from('sessions')
    .update({ status: 'completed', completed_at: new Date().toISOString() })
    .eq('id', sessionId)

  if (error) throw error
}

export async function reopenSession(sessionId: string): Promise<void> {
  const { error } = await supabase
    .from('sessions')
    .update({ status: 'in_progress', completed_at: null })
    .eq('id', sessionId)

  if (error) throw error
}

export async function reopenSessionForEditing(sessionId: string): Promise<Leg[]> {
  const { legs } = await getSessionWithLegs(sessionId)
  await reopenSession(sessionId)
  await Promise.all(legs.filter((l) => l.status === 'reconciled').map((l) => reopenLeg(l.id)))
  return legs
}
