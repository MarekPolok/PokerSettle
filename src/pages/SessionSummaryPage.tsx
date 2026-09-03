import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { strings } from '../strings.pl'
import { useSession } from '../hooks/useSession'
import { SummaryTable } from '../components/SummaryTable'
import { ShareButton } from '../components/ShareButton'
import { sessionSummary } from '../lib/calculations'
import { buildShareText } from '../lib/share'
import { formatCurrency } from '../lib/format'
import { completeSession, reopenSessionForEditing } from '../api/sessions'
import { BackButton } from '../components/BackButton'

export function SessionSummaryPage() {
  const { sessionId } = useParams()
  const navigate = useNavigate()
  const { session, legsData, loading, error, refetch } = useSession(sessionId)
  const [busy, setBusy] = useState(false)

  if (loading && !session) {
    return (
      <main className="mx-auto max-w-md p-4 text-slate-500">
        <BackButton />
        {strings.common.loading}
      </main>
    )
  }
  if (error || !session) {
    return (
      <main className="mx-auto max-w-md p-4 text-red-600">
        <BackButton />
        {error ?? 'Nie znaleziono sesji'}
      </main>
    )
  }

  const legs = legsData.map((d) => d.leg)
  const { potTotal, rows } = sessionSummary(legsData)
  const allLegsReconciled = legs.length > 0 && legs.every((l) => l.status === 'reconciled')
  const shareText = buildShareText(session.name, potTotal, rows)

  async function handleReopen() {
    if (!sessionId) return
    setBusy(true)
    try {
      const reopenedLegs = await reopenSessionForEditing(sessionId)
      navigate(`/sessions/${sessionId}/legs/${reopenedLegs[0].id}/buy-ins`)
    } finally {
      setBusy(false)
    }
  }

  async function handleComplete() {
    setBusy(true)
    try {
      await completeSession(sessionId!)
      await refetch()
    } finally {
      setBusy(false)
    }
  }

  return (
    <main className="mx-auto max-w-md p-4">
      <BackButton />
      <h1 className="mb-1 text-2xl font-semibold">{strings.summary.title}</h1>
      <p className="mb-4 text-slate-500">{session.name}</p>

      <p className="mb-4 text-lg font-semibold">
        {strings.summary.totalPot}: {formatCurrency(potTotal)}
      </p>

      <div className="mb-4">
        <SummaryTable legs={legs} rows={rows} />
      </div>

      <div className="flex flex-col gap-2">
        <ShareButton text={shareText} />

        <button
          type="button"
          onClick={handleReopen}
          disabled={busy || !allLegsReconciled}
          className="w-full rounded-lg bg-slate-200 px-4 py-3 font-medium text-slate-900 disabled:opacity-50"
        >
          {strings.summary.reopenSession}
        </button>

        {session.status === 'completed' ? (
          <p className="text-center text-sm text-emerald-700">{strings.common.sessionCompletedLabel}</p>
        ) : (
          <button
            type="button"
            onClick={handleComplete}
            disabled={busy || !allLegsReconciled}
            className="w-full rounded-lg bg-emerald-600 px-4 py-3 font-medium text-white disabled:opacity-50"
          >
            {strings.summary.markComplete}
          </button>
        )}
      </div>
    </main>
  )
}
