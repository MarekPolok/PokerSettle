import { Link, useNavigate } from 'react-router-dom'
import { strings } from '../strings.pl'
import { useSessions } from '../hooks/useSessions'
import { useAuth } from '../hooks/useAuth'
import { SessionListItem } from '../components/SessionListItem'
import { PageHeader } from '../components/PageHeader'
import { getSessionWithLegs } from '../api/sessions'
import { listCashOutsForLeg } from '../api/cashOuts'

export function HomePage() {
  const navigate = useNavigate()
  const { isAdmin } = useAuth()
  const { sessions, loading, error } = useSessions()

  async function handleResume(sessionId: string) {
    const { legs } = await getSessionWithLegs(sessionId)
    const activeLeg = legs.find((l) => l.status !== 'reconciled')

    if (!activeLeg) {
      // every leg is reconciled: either still deciding on a 2nd leg, or ready for the summary
      navigate(legs.length === 1 ? `/sessions/${sessionId}/between-legs` : `/sessions/${sessionId}`)
      return
    }

    const cashOuts = await listCashOutsForLeg(activeLeg.id)
    navigate(
      cashOuts.length > 0
        ? `/sessions/${sessionId}/legs/${activeLeg.id}/chip-count`
        : `/sessions/${sessionId}/legs/${activeLeg.id}/buy-ins`,
    )
  }

  return (
    <main className="mx-auto max-w-md p-4">
      <PageHeader />
      <h1 className="mb-4 text-2xl font-semibold">{strings.nav.home}</h1>
      <nav className="mb-6 flex flex-col gap-2">
        {isAdmin && (
          <Link className="rounded-lg bg-emerald-600 px-4 py-3 text-center font-medium text-white" to="/sessions/new">
            {strings.nav.newSession}
          </Link>
        )}
        <Link
          className="rounded-lg bg-slate-200 px-4 py-3 text-center font-medium text-slate-900 dark:bg-slate-700 dark:text-slate-100"
          to="/rankings"
        >
          {strings.nav.rankings}
        </Link>
        <Link
          className="rounded-lg bg-slate-200 px-4 py-3 text-center font-medium text-slate-900 dark:bg-slate-700 dark:text-slate-100"
          to="/players"
        >
          {strings.nav.players}
        </Link>
      </nav>

      {loading && <p className="text-slate-500 dark:text-slate-400">{strings.common.loading}</p>}
      {error && <p className="text-red-600 dark:text-red-400">{error}</p>}
      {!loading && sessions.length === 0 && <p className="text-slate-500 dark:text-slate-400">{strings.home.empty}</p>}

      <ul className="flex flex-col gap-2">
        {sessions.map((session) => (
          <SessionListItem key={session.id} session={session} onResume={handleResume} canResume={isAdmin} />
        ))}
      </ul>
    </main>
  )
}
