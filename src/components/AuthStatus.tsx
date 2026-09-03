import { Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { strings } from '../strings.pl'

export function AuthStatus() {
  const { isAdmin, loading, signOut } = useAuth()

  if (loading) return null

  if (!isAdmin) {
    return (
      <Link
        to="/login"
        className="rounded-lg border border-slate-300 px-2.5 py-1.5 text-sm text-slate-600 dark:border-slate-600 dark:text-slate-400"
      >
        {strings.auth.login}
      </Link>
    )
  }

  return (
    <button
      type="button"
      onClick={() => signOut()}
      className="rounded-lg border border-slate-300 px-2.5 py-1.5 text-sm text-slate-600 dark:border-slate-600 dark:text-slate-400"
    >
      {strings.auth.logout}
    </button>
  )
}
