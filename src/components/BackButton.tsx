import { Link } from 'react-router-dom'
import { strings } from '../strings.pl'

interface BackButtonProps {
  to?: string
}

export function BackButton({ to = '/' }: BackButtonProps) {
  return (
    <Link to={to} className="mb-4 inline-flex items-center gap-1 text-slate-600">
      <span aria-hidden="true">←</span>
      {strings.common.back}
    </Link>
  )
}
