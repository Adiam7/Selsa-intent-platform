import clsx from 'clsx';

type IntentType =
  | 'high_purchase' | 'buying' | 'research'
  | 'comparison' | 'browsing' | 'churn_risk' | 'unknown';

interface IntentScoreCardProps {
  userId: string;
  score: number;
  intentType: IntentType;
  confidence: number;
  updatedAt: string;
}

const INTENT_STYLES: Record<IntentType, string> = {
  high_purchase: 'bg-green-500/10 text-green-400 border-green-500/30',
  buying: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
  research: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
  comparison: 'bg-violet-500/10 text-violet-400 border-violet-500/30',
  browsing: 'bg-slate-500/10 text-slate-400 border-slate-500/30',
  churn_risk: 'bg-red-500/10 text-red-400 border-red-500/30',
  unknown: 'bg-zinc-500/10 text-zinc-400 border-zinc-500/30',
};

export function IntentScoreCard({
  userId,
  score,
  intentType,
  confidence,
  updatedAt,
}: IntentScoreCardProps) {
  return (
    <div className="bg-[var(--surface)] rounded-xl border border-[var(--border)] p-5 space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-xs text-[var(--muted)] font-mono truncate">{userId}</p>
        <span
          className={clsx(
            'text-xs font-medium px-2 py-0.5 rounded border',
            INTENT_STYLES[intentType],
          )}
        >
          {intentType.replace('_', ' ')}
        </span>
      </div>

      {/* Score bar */}
      <div>
        <div className="flex justify-between text-xs mb-1">
          <span className="text-[var(--muted)]">Intent Score</span>
          <span className="font-semibold">{score}</span>
        </div>
        <div className="h-2 rounded-full bg-[var(--border)] overflow-hidden">
          <div
            className="h-full rounded-full bg-indigo-500 transition-all"
            style={{ width: `${score}%` }}
          />
        </div>
      </div>

      <div className="flex justify-between text-xs text-[var(--muted)]">
        <span>Confidence: {(confidence * 100).toFixed(0)}%</span>
        <span>{updatedAt}</span>
      </div>
    </div>
  );
}
