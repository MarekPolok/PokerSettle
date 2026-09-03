import { Area, AreaChart, CartesianGrid, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { formatCurrency } from '../lib/format'
import { ChartTooltipContent } from './ChartTooltipContent'
import type { PlayerChartPoint } from '../types'

interface PlayerNetTrendChartProps {
  data: PlayerChartPoint[]
}

export function PlayerNetTrendChart({ data }: PlayerNetTrendChartProps) {
  const isUp = data[data.length - 1].cumulative >= 0
  const color = isUp ? '#059669' : '#dc2626'

  return (
    <div style={{ height: 220 }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid stroke="#e2e8f0" vertical={false} />
          <XAxis dataKey="order" tickLine={false} axisLine={{ stroke: '#e2e8f0' }} tick={{ fontSize: 12 }} />
          <YAxis
            width={70}
            tickLine={false}
            axisLine={{ stroke: '#e2e8f0' }}
            tick={{ fontSize: 12 }}
            tickFormatter={formatCurrency}
          />
          <ReferenceLine y={0} stroke="#cbd5e1" />
          <Tooltip content={(props) => <ChartTooltipContent {...props} valueKey="cumulative" />} />
          <Area
            type="monotone"
            dataKey="cumulative"
            stroke={color}
            strokeWidth={2}
            fill={color}
            fillOpacity={0.1}
            dot={{ r: 3, fill: color, strokeWidth: 0 }}
            activeDot={{ r: 5, fill: color, stroke: '#ffffff', strokeWidth: 2 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
