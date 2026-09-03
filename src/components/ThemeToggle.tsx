import { useTheme } from '../hooks/useTheme'
import { strings } from '../strings.pl'

export function ThemeToggle() {
  const { theme, toggle } = useTheme()

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={theme === 'dark' ? strings.common.switchToLight : strings.common.switchToDark}
      className="rounded-lg border border-slate-300 px-2.5 py-1.5 text-sm text-slate-600 dark:border-slate-600 dark:text-slate-400"
    >
      <span aria-hidden="true">{theme === 'dark' ? '☀' : '☾'}</span>
    </button>
  )
}
