import { Area, AreaChart, CartesianGrid, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { formatCurrency } from '../lib/format'
import { CHART_COLORS } from '../lib/chartColors'
import { useTheme } from '../hooks/useTheme'
import { ChartTooltipContent } from './ChartTooltipContent'
import type { PlayerChartPoint } from '../types'

interface PlayerNetTrendChartProps {
  data: PlayerChartPoint[]
}

export function PlayerNetTrendChart({ data }: PlayerNetTrendChartProps) {
  const { theme } = useTheme()
  const colors = CHART_COLORS[theme]
  const isUp = data[data.length - 1].cumulative >= 0
  const color = isUp ? colors.up : colors.down

  return (
    <div style={{ height: 220 }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid stroke={colors.grid} vertical={false} />
          <XAxis dataKey="order" tickLine={false} axisLine={{ stroke: colors.grid }} tick={{ fontSize: 12 }} />
          <YAxis
            width={70}
            tickLine={false}
            axisLine={{ stroke: colors.grid }}
            tick={{ fontSize: 12 }}
            tickFormatter={formatCurrency}
          />
          <ReferenceLine y={0} stroke={colors.baseline} />
          <Tooltip content={(props) => <ChartTooltipContent {...props} valueKey="cumulative" />} />
          <Area
            type="monotone"
            dataKey="cumulative"
            stroke={color}
            strokeWidth={2}
            fill={color}
            fillOpacity={0.1}
            dot={{ r: 3, fill: color, strokeWidth: 0 }}
            activeDot={{ r: 5, fill: color, stroke: theme === 'dark' ? '#0f172a' : '#ffffff', strokeWidth: 2 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
