import { strings } from '../strings.pl'

export function RankingsPage() {
  return (
    <main className="mx-auto max-w-md p-4">
      <h1 className="mb-4 text-2xl font-semibold">{strings.rankings.title}</h1>
      <p className="text-slate-500">TODO: Phase 7 — all-time leaderboard, tie handling.</p>
    </main>
  )
}
