import { strings } from '../strings.pl'
import type { Player } from '../types'

interface PlayerListItemProps {
  player: Player
  onArchive: (id: string) => void
}

export function PlayerListItem({ player, onArchive }: PlayerListItemProps) {
  return (
    <li className="flex items-center justify-between rounded-lg border border-slate-200 px-4 py-3">
      <span className="font-medium">{player.name}</span>
      <button
        type="button"
        onClick={() => onArchive(player.id)}
        className="rounded-md px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50"
      >
        {strings.players.archive}
      </button>
    </li>
  )
}
