import { useCallback, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { strings } from '../strings.pl'
import { getSessionWithLegs } from '../api/sessions'
import { createLeg } from '../api/legs'
import { PlayerMultiSelect } from '../components/PlayerMultiSelect'
import { BackButton } from '../components/BackButton'
import type { Leg } from '../types'

export function BetweenLegsPage() {
  const { sessionId } = useParams()
  const navigate = useNavigate()
  const [legs, setLegs] = useState<Leg[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddLeg, setShowAddLeg] = useState(false)
  const [participantIds, setParticipantIds] = useState<string[]>([])
  const [submitting, setSubmitting] = useState(false)

  const refetch = useCallback(async () => {
    if (!sessionId) return
    setLoading(true)
    const { legs } = await getSessionWithLegs(sessionId)
    setLegs(legs)
    setLoading(false)
  }, [sessionId])

  useEffect(() => {
    refetch()
  }, [refetch])

  if (loading) {
    return (
      <main className="mx-auto max-w-md p-4 text-slate-500">
        <BackButton />
        {strings.common.loading}
      </main>
    )
  }

  const hasSecondLeg = legs.some((l) => l.leg_order === 2)

  async function handleAddSecondLeg() {
    if (!sessionId || participantIds.length === 0) return
    setSubmitting(true)
    try {
      const leg = await createLeg(sessionId, strings.leg.defaultLabelLeg2, 2, participantIds)
      navigate(`/sessions/${sessionId}/legs/${leg.id}/buy-ins`)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className="mx-auto max-w-md p-4">
      <BackButton />
      <h1 className="mb-4 text-2xl font-semibold">{strings.leg.label}</h1>

      {!hasSecondLeg &&
        (showAddLeg ? (
          <div className="mb-4 rounded-lg border border-slate-200 p-3">
            <PlayerMultiSelect selectedIds={participantIds} onChange={setParticipantIds} />
            <button
              type="button"
              onClick={handleAddSecondLeg}
              disabled={submitting || participantIds.length === 0}
              className="mt-3 w-full rounded-lg bg-emerald-600 px-4 py-3 font-medium text-white disabled:opacity-50"
            >
              {strings.betweenLegs.addSecondLeg}
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setShowAddLeg(true)}
            className="mb-2 w-full rounded-lg bg-emerald-600 px-4 py-3 font-medium text-white"
          >
            {strings.betweenLegs.addSecondLeg}
          </button>
        ))}

      <button
        type="button"
        onClick={() => navigate(`/sessions/${sessionId}`)}
        className="w-full rounded-lg bg-slate-200 px-4 py-3 font-medium text-slate-900"
      >
        {hasSecondLeg ? strings.betweenLegs.finishSession : strings.betweenLegs.finishWithThisLegOnly}
      </button>
    </main>
  )
}
