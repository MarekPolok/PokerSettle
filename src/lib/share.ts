import { strings } from '../strings.pl'
import { formatCurrency } from './format'
import type { SessionSummaryRow } from './calculations'

export function buildShareText(sessionName: string, potTotal: number, rows: SessionSummaryRow[]): string {
  const lines = rows.map((r) =>
    r.totalNet >= 0
      ? strings.shareTemplate.lineUp(r.playerName, formatCurrency(r.totalNet))
      : strings.shareTemplate.lineDown(r.playerName, formatCurrency(r.totalNet)),
  )

  return [strings.shareTemplate.header(sessionName), strings.shareTemplate.pot(formatCurrency(potTotal)), '', ...lines].join(
    '\n',
  )
}
