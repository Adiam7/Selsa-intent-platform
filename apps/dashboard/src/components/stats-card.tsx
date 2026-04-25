import clsx from 'clsx';

interface StatsCardProps {
  label: string;
  value: string | number;
  accent?: boolean;
  danger?: boolean;
}

export function StatsCard({ label, value, accent, danger }: StatsCardProps) {
  return (
    <div className="bg-[var(--surface)] rounded-xl border border-[var(--border)] p-4">
      <p className="text-xs text-[var(--muted)] mb-1">{label}</p>
      <p
        className={clsx(
          'text-2xl font-bold',
          accent && 'text-indigo-400',
          danger && 'text-red-400',
          !accent && !danger && 'text-[var(--text)]',
        )}
      >
        {value}
      </p>
    </div>
  );
}
