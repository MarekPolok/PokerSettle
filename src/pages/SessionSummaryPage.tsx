import { strings } from '../strings.pl'

export function SessionSummaryPage() {
  return (
    <main className="mx-auto max-w-md p-4">
      <h1 className="mb-4 text-2xl font-semibold">{strings.summary.title}</h1>
      <p className="text-slate-500">TODO: Phase 6 — resume routing, summary table, share, reopen/complete.</p>
    </main>
  )
}
