import { useMemo } from 'react'
import { Link, useLocation, useParams } from 'react-router-dom'
import { strings } from '../strings.pl'
import { usePlayerStats } from '../hooks/usePlayerStats'
import { BackButton } from '../components/BackButton'
import { PlayerNetTrendChart } from '../components/PlayerNetTrendChart'
import { PlayerSessionResultsChart } from '../components/PlayerSessionResultsChart'
import { formatCurrency, formatDate } from '../lib/format'
import { round2 } from '../lib/calculations'
import type { PlayerChartPoint } from '../types'

export function PlayerStatsPage() {
  const { playerId } = useParams()
  const location = useLocation()
  const { player, ranking, history, loading, error } = usePlayerStats(playerId)

  const backTo = (location.state as { from?: string } | null)?.from === 'rankings' ? '/rankings' : '/players'

  const chartRows = useMemo<PlayerChartPoint[]>(() => {
    return [...history].reverse().reduce<PlayerChartPoint[]>((rows, h) => {
      const cumulative = round2((rows[rows.length - 1]?.cumulative ?? 0) + h.net)
      rows.push({ order: rows.length + 1, sessionName: h.sessionName, date: h.completedAt, net: h.net, cumulative })
      return rows
    }, [])
  }, [history])

  if (loading && !player) {
    return (
      <main className="mx-auto max-w-md p-4 text-slate-500">
        <BackButton to={backTo} />
        {strings.common.loading}
      </main>
    )
  }
  if (error || !player) {
    return (
      <main className="mx-auto max-w-md p-4 text-red-600">
        <BackButton to={backTo} />
        {error ?? strings.playerStats.notFound}
      </main>
    )
  }

  return (
    <main className="mx-auto max-w-md p-4">
      <BackButton to="/players" />
      <h1 className="mb-4 text-2xl font-semibold">{player.name}</h1>

      {ranking ? (
        <>
          <div className="mb-4 rounded-lg border border-slate-200 p-3">
            <div className="flex items-center justify-between gap-2">
              <span className="font-medium">{strings.rankings.allTimeNet}</span>
              <span className={`text-lg font-semibold ${ranking.totalNet >= 0 ? 'text-emerald-700' : 'text-red-700'}`}>
                {formatCurrency(ranking.totalNet)}
              </span>
            </div>
            <div className="mt-1 flex gap-4 text-sm text-slate-500">
              <span>
                {strings.rankings.sessionsPlayed}: {ranking.sessionsPlayed}
              </span>
              <span>
                {strings.rankings.avgPerSession}: {formatCurrency(ranking.avgPerSession)}
              </span>
            </div>
            <p className="mt-1 text-sm text-slate-500">{strings.playerStats.rank(ranking.rank)}</p>
          </div>

          <h2 className="mb-2 text-lg font-semibold">{strings.playerStats.trendTitle}</h2>
          <div className="mb-4 rounded-lg border border-slate-200 p-3">
            <PlayerNetTrendChart data={chartRows} />
          </div>

          <h2 className="mb-2 text-lg font-semibold">{strings.playerStats.perSessionTitle}</h2>
          <div className="mb-4 rounded-lg border border-slate-200 p-3">
            <PlayerSessionResultsChart data={chartRows} />
          </div>

          <h2 className="mb-2 text-lg font-semibold">{strings.playerStats.historyTitle}</h2>
          <ul className="flex flex-col gap-2">
            {history.map((h) => (
              <li key={h.sessionId} className="rounded-lg border border-slate-200 p-3">
                <Link to={`/sessions/${h.sessionId}`} className="flex items-center justify-between gap-2">
                  <span>
                    <span className="font-medium">{h.sessionName}</span>
                    {h.completedAt && <span className="ml-2 text-sm text-slate-500">{formatDate(h.completedAt)}</span>}
                  </span>
                  <span className={`font-semibold ${h.net >= 0 ? 'text-emerald-700' : 'text-red-700'}`}>
                    {formatCurrency(h.net)}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </>
      ) : (
        <p className="text-slate-500">{strings.rankings.empty}</p>
      )}
    </main>
  )
}
