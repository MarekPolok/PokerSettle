import { strings } from '../strings.pl'
import { formatCurrency } from '../lib/format'
import type { ReconciliationStatus } from '../lib/calculations'

export function ReconciliationBanner({ totalBuyIns, totalChips, diff, matches }: ReconciliationStatus) {
  return (
    <div
      className={`rounded-lg border p-4 ${matches ? 'border-emerald-300 bg-emerald-50 dark:border-emerald-700 dark:bg-emerald-950' : 'border-red-300 bg-red-50 dark:border-red-700 dark:bg-red-950'}`}
    >
      <div className="mb-2 flex justify-between text-sm">
        <span>{strings.chipCount.totalBuyIns}</span>
        <span className="font-medium">{formatCurrency(totalBuyIns)}</span>
      </div>
      <div className="mb-2 flex justify-between text-sm">
        <span>{strings.chipCount.totalChips}</span>
        <span className="font-medium">{formatCurrency(totalChips)}</span>
      </div>
      {matches ? (
        <p className="font-semibold text-emerald-700 dark:text-emerald-400">✅ {strings.chipCount.matches}</p>
      ) : (
        <p className="font-semibold text-red-700 dark:text-red-400">
          ⚠️{' '}
          {diff < 0
            ? strings.chipCount.short(formatCurrency(Math.abs(diff)))
            : strings.chipCount.over(formatCurrency(diff))}
        </p>
      )}
    </div>
  )
}
