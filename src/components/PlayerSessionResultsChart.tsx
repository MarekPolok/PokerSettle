import { Bar, BarChart, CartesianGrid, Cell, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { formatCurrency } from '../lib/format'
import { ChartTooltipContent } from './ChartTooltipContent'
import type { PlayerChartPoint } from '../types'

interface PlayerSessionResultsChartProps {
  data: PlayerChartPoint[]
}

export function PlayerSessionResultsChart({ data }: PlayerSessionResultsChartProps) {
  return (
    <div style={{ height: 220 }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
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
          <Tooltip content={(props) => <ChartTooltipContent {...props} valueKey="net" />} />
          <Bar dataKey="net" maxBarSize={24}>
            {data.map((d) => (
              <Cell key={d.order} fill={d.net >= 0 ? '#059669' : '#dc2626'} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
