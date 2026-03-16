import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{
        background: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: '8px',
        padding: '8px 12px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
      }}>
        <p style={{ fontSize: 12, color: '#64748b', marginBottom: 2 }}>{label}</p>
        <p style={{ fontSize: 13, fontWeight: 600, color: '#0f172a' }}>
          {payload[0].value} cards
        </p>
      </div>
    )
  }
  return null
}

export function ActivityChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height={180}>
      <BarChart data={data} barSize={28}>
        <XAxis
          dataKey="day"
          tick={{ fontSize: 12, fill: '#94a3b8' }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis hide />
        <Tooltip
          content={<CustomTooltip />}
          cursor={{ fill: '#f1f5f9', radius: 4 }}
        />
        <Bar dataKey="cards" radius={[4, 4, 0, 0]}>
          {data.map((entry, i) => (
            <Cell
              key={i}
              fill={entry.cards > 0 ? '#6366f1' : '#e2e8f0'}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}