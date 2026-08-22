import { Link } from 'react-router-dom'
import { strings } from '../strings.pl'
import { formatCurrency, formatDate } from '../lib/format'
import type { SessionListEntry } from '../hooks/useSessions'

interface SessionListItemProps {
  session: SessionListEntry
  onResume: (sessionId: string) => void
}

export function SessionListItem({ session, onResume }: SessionListItemProps) {
  const isInProgress = session.status === 'in_progress'

  const content = (
    <div className="flex items-center justify-between gap-2">
      <div>
        <p className="font-medium">{session.name}</p>
        {!isInProgress && (
          <p className="text-sm text-slate-500">
            {formatDate(session.completed_at ?? session.created_at)}
            {session.potTotal !== null && ` · ${formatCurrency(session.potTotal)}`}
          </p>
        )}
      </div>
      {isInProgress && (
        <span className="rounded-lg bg-amber-500 px-3 py-2 text-sm font-medium text-white">
          {strings.home.resumeBadge}
        </span>
      )}
    </div>
  )

  if (isInProgress) {
    return (
      <li>
        <button
          type="button"
          onClick={() => onResume(session.id)}
          className="w-full rounded-lg border border-slate-200 p-3 text-left"
        >
          {content}
        </button>
      </li>
    )
  }

  return (
    <li>
      <Link to={`/sessions/${session.id}`} className="block rounded-lg border border-slate-200 p-3">
        {content}
      </Link>
    </li>
  )
}
