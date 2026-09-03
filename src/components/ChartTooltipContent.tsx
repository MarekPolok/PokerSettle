import { formatCurrency, formatDate } from '../lib/format'
import type { PlayerChartPoint } from '../types'

interface ChartTooltipContentProps {
  active?: boolean
  payload?: readonly { payload?: PlayerChartPoint }[]
  valueKey: 'net' | 'cumulative'
}

export function ChartTooltipContent({ active, payload, valueKey }: ChartTooltipContentProps) {
  const point = payload?.[0]?.payload
  if (!active || !point) return null

  const value = point[valueKey]

  return (
    <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 shadow-sm dark:border-slate-700 dark:bg-slate-800">
      <p className="text-sm text-slate-500 dark:text-slate-400">
        {point.sessionName}
        {point.date && <> · {formatDate(point.date)}</>}
      </p>
      <p
        className={`text-lg font-semibold ${value >= 0 ? 'text-emerald-700 dark:text-emerald-400' : 'text-red-700 dark:text-red-400'}`}
      >
        {formatCurrency(value)}
      </p>
    </div>
  )
}
