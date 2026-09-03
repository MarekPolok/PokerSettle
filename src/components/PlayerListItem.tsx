import { Link } from 'react-router-dom'
import { strings } from '../strings.pl'
import { useAuth } from '../hooks/useAuth'
import type { Player } from '../types'

interface PlayerListItemProps {
  player: Player
  onArchive: (id: string) => void
}

export function PlayerListItem({ player, onArchive }: PlayerListItemProps) {
  const { isAdmin } = useAuth()

  return (
    <li className="flex items-center justify-between rounded-lg border border-slate-200 px-4 py-3 dark:border-slate-700">
      <Link
        to={`/players/${player.id}`}
        state={{ from: 'players' }}
        className="font-medium text-slate-900 underline-offset-2 hover:underline dark:text-slate-100"
      >
        {player.name}
      </Link>
      {isAdmin && (
        <button
          type="button"
          onClick={() => onArchive(player.id)}
          className="rounded-md px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950"
        >
          {strings.players.archive}
        </button>
      )}
    </li>
  )
}
