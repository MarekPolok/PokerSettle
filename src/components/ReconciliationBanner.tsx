import { strings } from '../strings.pl'
import { formatCurrency } from '../lib/format'
import type { ReconciliationStatus } from '../lib/calculations'

export function ReconciliationBanner({ totalBuyIns, totalChips, diff, matches }: ReconciliationStatus) {
  return (
    <div
      className={`rounded-lg border p-4 ${matches ? 'border-emerald-300 bg-emerald-50' : 'border-red-300 bg-red-50'}`}
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
        <p className="font-semibold text-emerald-700">✅ {strings.chipCount.matches}</p>
      ) : (
        <p className="font-semibold text-red-700">
          ⚠️{' '}
          {diff < 0
            ? strings.chipCount.short(formatCurrency(Math.abs(diff)))
            : strings.chipCount.over(formatCurrency(diff))}
        </p>
      )}
    </div>
  )
}
