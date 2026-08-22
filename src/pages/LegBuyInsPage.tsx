import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { strings } from '../strings.pl'
import { useLeg } from '../hooks/useLeg'
import { BuyInRow } from '../components/BuyInRow'
import { PlayerMultiSelect } from '../components/PlayerMultiSelect'

export function LegBuyInsPage() {
  const { sessionId, legId } = useParams()
  const navigate = useNavigate()
  const { leg, participants, buyIns, loading, error, logBuyIn, editBuyIn, removeBuyIn, addParticipants } =
    useLeg(legId)

  const [showAddParticipant, setShowAddParticipant] = useState(false)
  const [newParticipantIds, setNewParticipantIds] = useState<string[]>([])
  const [addingParticipants, setAddingParticipants] = useState(false)

  async function handleAddParticipants() {
    if (newParticipantIds.length === 0) return
    setAddingParticipants(true)
    try {
      await addParticipants(newParticipantIds)
      setNewParticipantIds([])
      setShowAddParticipant(false)
    } finally {
      setAddingParticipants(false)
    }
  }

  if (loading && !leg) {
    return <main className="mx-auto max-w-md p-4 text-slate-500">{strings.common.loading}</main>
  }
  if (error || !leg) {
    return <main className="mx-auto max-w-md p-4 text-red-600">{error ?? 'Nie znaleziono odcinka'}</main>
  }

  return (
    <main className="mx-auto max-w-md p-4">
      <h1 className="mb-4 text-2xl font-semibold">{strings.leg.headerWithOfTwo(leg.label, leg.leg_order)}</h1>

      <ul className="flex flex-col gap-3">
        {participants.map(({ playerId, player }) => (
          <BuyInRow
            key={playerId}
            player={player}
            buyIns={buyIns}
            onLog={logBuyIn}
            onEdit={editBuyIn}
            onDelete={removeBuyIn}
          />
        ))}
      </ul>

      <div className="mt-4">
        {showAddParticipant ? (
          <div className="rounded-lg border border-slate-200 p-3">
            <PlayerMultiSelect
              selectedIds={newParticipantIds}
              onChange={setNewParticipantIds}
              excludeIds={participants.map((p) => p.playerId)}
            />
            <button
              type="button"
              onClick={handleAddParticipants}
              disabled={addingParticipants || newParticipantIds.length === 0}
              className="mt-3 w-full rounded-lg bg-slate-700 px-4 py-2 font-medium text-white disabled:opacity-50"
            >
              {strings.buyIns.addPlayerToLeg}
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setShowAddParticipant(true)}
            className="w-full rounded-lg bg-slate-200 px-4 py-2 font-medium text-slate-900"
          >
            {strings.buyIns.addPlayerToLeg}
          </button>
        )}
      </div>

      <button
        type="button"
        onClick={() => navigate(`/sessions/${sessionId}/legs/${legId}/chip-count`)}
        className="mt-6 w-full rounded-lg bg-emerald-600 px-4 py-3 font-medium text-white"
      >
        {strings.buyIns.finishArrow}
      </button>
    </main>
  )
}
