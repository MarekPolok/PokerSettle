import { Link } from 'react-router-dom'
import { strings } from '../strings.pl'

export function HomePage() {
  return (
    <main className="mx-auto max-w-md p-4">
      <h1 className="mb-4 text-2xl font-semibold">{strings.nav.home}</h1>
      <nav className="flex flex-col gap-2">
        <Link className="rounded-lg bg-emerald-600 px-4 py-3 text-center font-medium text-white" to="/sessions/new">
          {strings.nav.newSession}
        </Link>
        <Link className="rounded-lg bg-slate-200 px-4 py-3 text-center font-medium text-slate-900" to="/rankings">
          {strings.nav.rankings}
        </Link>
        <Link className="rounded-lg bg-slate-200 px-4 py-3 text-center font-medium text-slate-900" to="/players">
          {strings.nav.players}
        </Link>
      </nav>
    </main>
  )
}
