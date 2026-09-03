import type { Theme } from '../hooks/useTheme'

export const CHART_COLORS: Record<Theme, { up: string; down: string; grid: string; baseline: string }> = {
  light: { up: '#059669', down: '#dc2626', grid: '#e2e8f0', baseline: '#cbd5e1' },
  dark: { up: '#34d399', down: '#f87171', grid: '#334155', baseline: '#475569' },
}
