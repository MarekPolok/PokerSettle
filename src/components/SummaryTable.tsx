import { strings } from '../strings.pl'
import { formatCurrency } from '../lib/format'
import type { SessionSummaryRow } from '../lib/calculations'
import type { Leg } from '../types'

interface SummaryTableProps {
  legs: Leg[]
  rows: SessionSummaryRow[]
}

// A stacked card list rather than an HTML table: with 2 legs + a total column,
// a table overflows narrow phone screens and hides the total off-screen with
// no visible scroll affordance — a card per player avoids that regardless of
// name length or leg count.
export function SummaryTable({ legs, rows }: SummaryTableProps) {
  return (
    <div className="flex flex-col gap-2">
      <p className="px-1 text-xs font-medium tracking-wide text-slate-500 uppercase dark:text-slate-400">
        {strings.summary.player}
      </p>
      {rows.map((row) => (
        <div key={row.playerId} className="rounded-lg border border-slate-200 p-3 dark:border-slate-700">
          <div className="flex items-center justify-between gap-2">
            <span className="font-medium">
              {row.totalNet >= 0 ? '🟢' : '🔴'} {row.playerName}
            </span>
            <span
              className={`text-lg font-semibold ${row.totalNet >= 0 ? 'text-emerald-700 dark:text-emerald-400' : 'text-red-700 dark:text-red-400'}`}
            >
              {formatCurrency(row.totalNet)}
            </span>
          </div>
          {legs.length > 1 && (
            <div className="mt-1 flex gap-4 text-sm text-slate-500 dark:text-slate-400">
              {legs.map((leg, i) => (
                <span key={leg.id}>
                  {leg.label}: {row.legNets[i] === null ? '—' : formatCurrency(row.legNets[i]!)}
                </span>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
