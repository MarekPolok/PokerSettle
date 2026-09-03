import { BackButton } from './BackButton'
import { ThemeToggle } from './ThemeToggle'
import { AuthStatus } from './AuthStatus'

interface PageHeaderProps {
  backTo?: string
}

export function PageHeader({ backTo }: PageHeaderProps) {
  return (
    <div className="mb-4 flex items-center justify-between">
      {backTo ? <BackButton to={backTo} /> : <span />}
      <div className="flex items-center gap-2">
        <AuthStatus />
        <ThemeToggle />
      </div>
    </div>
  )
}
