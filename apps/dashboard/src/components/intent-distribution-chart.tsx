'use client';

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const COLORS: Record<string, string> = {
  high_purchase: '#22c55e',
  buying: '#84cc16',
  research: '#3b82f6',
  comparison: '#8b5cf6',
  browsing: '#94a3b8',
  churn_risk: '#ef4444',
  unknown: '#475569',
};

const MOCK_DATA = [
  { name: 'high_purchase', value: 18 },
  { name: 'buying', value: 22 },
  { name: 'research', value: 30 },
  { name: 'browsing', value: 20 },
  { name: 'churn_risk', value: 10 },
];

export function IntentDistributionChart() {
  return (
    <div className="bg-[var(--surface)] rounded-xl border border-[var(--border)] p-5">
      <h2 className="text-sm font-medium text-[var(--muted)] mb-4">Intent Distribution</h2>
      <ResponsiveContainer width="100%" height={240}>
        <PieChart>
          <Pie
            data={MOCK_DATA}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={90}
            label={({ name, percent }) =>
              `${name} ${(percent * 100).toFixed(0)}%`
            }
          >
            {MOCK_DATA.map(entry => (
              <Cell
                key={entry.name}
                fill={COLORS[entry.name] ?? '#475569'}
              />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
          />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
