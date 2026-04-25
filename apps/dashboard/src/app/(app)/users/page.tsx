'use client';

import useSWR from 'swr';
import { IntentScoreCard } from '@/components/intent-score-card';

const fetcher = (url: string) => fetch(url).then(r => r.json());

export default function UsersPage() {
  const { data, isLoading } = useSWR('/api/users?limit=20', fetcher);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Users</h1>

      {isLoading && (
        <p className="text-[var(--muted)]">Loading users...</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {/* Demo cards when API is not connected */}
        {[
          { userId: 'user-demo-1', score: 82, intentType: 'high_purchase', confidence: 0.85, updatedAt: '2 min ago' },
          { userId: 'user-demo-2', score: 55, intentType: 'research', confidence: 0.70, updatedAt: '5 min ago' },
          { userId: 'user-demo-3', score: 20, intentType: 'churn_risk', confidence: 0.60, updatedAt: '1 hr ago' },
        ].map(u => (
          <IntentScoreCard key={u.userId} {...(u as never)} />
        ))}
      </div>
    </div>
  );
}
