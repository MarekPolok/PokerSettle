import { useNavigate, useParams } from 'react-router-dom'
import { strings } from '../strings.pl'
import { useLeg } from '../hooks/useLeg'
import { ChipCountRow } from '../components/ChipCountRow'
import { ReconciliationBanner } from '../components/ReconciliationBanner'
import { reconciliationStatus } from '../lib/calculations'

export function LegChipCountPage() {
  const { sessionId, legId } = useParams()
  const navigate = useNavigate()
  const { leg, participants, buyIns, cashOuts, loading, error, setChipCount, reconcile } = useLeg(legId)

  if (loading && !leg) {
    return <main className="mx-auto max-w-md p-4 text-slate-500">{strings.common.loading}</main>
  }
  if (error || !leg) {
    return <main className="mx-auto max-w-md p-4 text-red-600">{error ?? 'Nie znaleziono odcinka'}</main>
  }

  const status = reconciliationStatus(buyIns, cashOuts)

  async function handleFinish() {
    if (!status.matches) return
    await reconcile()
    navigate(`/sessions/${sessionId}/between-legs`)
  }

  return (
    <main className="mx-auto max-w-md p-4">
      <h1 className="mb-1 text-2xl font-semibold">{strings.chipCount.title}</h1>
      <p className="mb-4 text-slate-500">{strings.leg.headerWithOfTwo(leg.label, leg.leg_order)}</p>

      <ul className="mb-4 flex flex-col gap-3">
        {participants.map(({ playerId, player }) => (
          <ChipCountRow
            key={playerId}
            player={player}
            cashOut={cashOuts.find((c) => c.player_id === playerId)}
            onChange={setChipCount}
          />
        ))}
      </ul>

      <div className="mb-4">
        <ReconciliationBanner {...status} />
      </div>

      <div className="flex flex-col gap-2">
        <button
          type="button"
          onClick={handleFinish}
          disabled={!status.matches}
          className="w-full rounded-lg bg-emerald-600 px-4 py-3 font-medium text-white disabled:opacity-50"
        >
          {strings.chipCount.finishLeg}
        </button>
        <button
          type="button"
          onClick={() => navigate(`/sessions/${sessionId}/legs/${legId}/buy-ins`)}
          className="w-full rounded-lg bg-slate-200 px-4 py-3 font-medium text-slate-900"
        >
          {strings.chipCount.backToBuyIns}
        </button>
      </div>
    </main>
  )
}
