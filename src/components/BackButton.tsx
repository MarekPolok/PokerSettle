import { Link } from 'react-router-dom'
import { strings } from '../strings.pl'

export function BackButton() {
  return (
    <Link to="/" className="mb-4 inline-flex items-center gap-1 text-slate-600">
      <span aria-hidden="true">←</span>
      {strings.common.back}
    </Link>
  )
}
