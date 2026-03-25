import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { useTheme } from 'next-themes'

const CustomTooltip = ({ active, payload, label, dark }) => {
  if (active && payload && payload.length) {
    const value = payload[0].value
    return (
      <div style={{
        background:   dark ? '#1e2a3a' : '#ffffff',
        border:       `1px solid ${dark ? '#2d3f55' : '#e2e8f0'}`,
        borderRadius: '8px',
        padding:      '8px 12px',
        boxShadow:    '0 2px 8px rgba(0,0,0,0.12)',
      }}>
        <p style={{ fontSize: 12, color: dark ? '#94a3b8' : '#64748b', marginBottom: 2 }}>{label}</p>
        <p style={{ fontSize: 13, fontWeight: 600, color: dark ? '#e2e8f0' : '#0f172a' }}>
          {value} {value === 1 ? 'session' : 'sessions'}
        </p>
      </div>
    )
  }
  return null
}

export function ActivityChart({ data }) {
  const { theme } = useTheme()
  const dark = theme === 'dark'

  return (
    <ResponsiveContainer width="100%" height={180}>
      <BarChart data={data} barSize={28}>
        <XAxis
          dataKey="day"
          tick={{ fontSize: 12, fill: dark ? '#64748b' : '#94a3b8' }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis hide />
        <Tooltip
          content={<CustomTooltip dark={dark} />}
          cursor={{ fill: dark ? '#1e2a3a' : '#f1f5f9', radius: 4 }}
        />
        <Bar dataKey="cards" radius={[4, 4, 0, 0]}>
          {data.map((entry, i) => (
            <Cell
              key={i}
              fill={entry.cards > 0
                ? (dark ? '#38bdf8' : '#0284c7')
                : (dark ? '#1e2a3a' : '#e2e8f0')
              }
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}