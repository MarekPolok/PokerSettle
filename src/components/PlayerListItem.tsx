import { Link } from 'react-router-dom'
import type { Player } from '../types'

interface PlayerListItemProps {
  player: Player
}

export function PlayerListItem({ player }: PlayerListItemProps) {
  return (
    <li className="relative rounded-lg border border-slate-200 px-4 py-3 dark:border-slate-700">
      <Link to={`/players/${player.id}`} state={{ from: 'players' }} className="absolute inset-0" />
      <span className="font-medium text-slate-900 dark:text-slate-100">{player.name}</span>
    </li>
  )
}
