import { Link } from 'react-router-dom'
import { strings } from '../strings.pl'
import { formatCurrency } from '../lib/format'
import type { PlayerRanking } from '../types'

interface RankingsTableProps {
  rankings: PlayerRanking[]
}

export function RankingsTable({ rankings }: RankingsTableProps) {
  return (
    <ul className="flex flex-col gap-2">
      {rankings.map((r) => (
        <li key={r.playerId}>
          <Link
            to={`/players/${r.playerId}`}
            state={{ from: 'rankings' }}
            className="block rounded-lg border border-slate-200 p-3 dark:border-slate-700"
          >
            <div className="flex items-center justify-between gap-2">
              <span className="font-medium text-slate-900 dark:text-slate-100">
                #{r.rank} {r.playerName}
              </span>
              <span
                className={`text-lg font-semibold ${r.totalNet >= 0 ? 'text-emerald-700 dark:text-emerald-400' : 'text-red-700 dark:text-red-400'}`}
              >
                {formatCurrency(r.totalNet)}
              </span>
            </div>
            <div className="mt-1 flex gap-4 text-sm text-slate-500 dark:text-slate-400">
              <span>
                {strings.rankings.sessionsPlayed}: {r.sessionsPlayed}
              </span>
              <span>
                {strings.rankings.avgPerSession}: {formatCurrency(r.avgPerSession)}
              </span>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  )
}
