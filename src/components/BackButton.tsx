import { Link } from 'react-router-dom'
import { strings } from '../strings.pl'

interface BackButtonProps {
  to?: string
}

export function BackButton({ to = '/' }: BackButtonProps) {
  return (
    <Link to={to} className="inline-flex items-center gap-1 text-slate-600 dark:text-slate-400">
      <span aria-hidden="true">←</span>
      {strings.common.back}
    </Link>
  )
}
