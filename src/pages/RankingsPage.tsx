import { strings } from '../strings.pl'
import { useRankings } from '../hooks/useRankings'
import { RankingsTable } from '../components/RankingsTable'
import { PageHeader } from '../components/PageHeader'

export function RankingsPage() {
  const { rankings, loading, error } = useRankings()

  return (
    <main className="mx-auto max-w-md p-4">
      <PageHeader backTo="/" />
      <h1 className="mb-4 text-2xl font-semibold">{strings.rankings.title}</h1>
      {loading && <p className="text-slate-500 dark:text-slate-400">{strings.common.loading}</p>}
      {error && <p className="text-red-600 dark:text-red-400">{error}</p>}
      {!loading && rankings.length === 0 && (
        <p className="text-slate-500 dark:text-slate-400">{strings.rankings.empty}</p>
      )}
      <RankingsTable rankings={rankings} />
    </main>
  )
}
