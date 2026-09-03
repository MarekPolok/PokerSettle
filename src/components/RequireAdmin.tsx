import { Navigate } from 'react-router-dom'
import type { ReactNode } from 'react'
import { useAuth } from '../hooks/useAuth'
import { strings } from '../strings.pl'

export function RequireAdmin({ children }: { children: ReactNode }) {
  const { isAdmin, loading } = useAuth()

  if (loading) {
    return <main className="mx-auto max-w-md p-4 text-slate-500 dark:text-slate-400">{strings.common.loading}</main>
  }
  if (!isAdmin) {
    return <Navigate to="/" replace />
  }

  return <>{children}</>
}
