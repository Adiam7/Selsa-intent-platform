'use client';

import { ReactNode, useRef } from 'react';
import { cn } from '@/lib/cn';

interface IntentPillSwitcherProps {
  intents: { id: string; label: string; icon?: ReactNode }[];
  activeIntent: string;
  onIntentChange: (intentId: string) => void;
}

export function IntentPillSwitcher({
  intents,
  activeIntent,
  onIntentChange,
}: IntentPillSwitcherProps) {
  const ref = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={ref}
      className="flex gap-2 overflow-x-auto hide-scrollbar pb-0.5"
    >
      {intents.map(({ id, label, icon }) => {
        const isActive = activeIntent === id;
        return (
          <button
            key={id}
            onClick={() => onIntentChange(id)}
            className={cn(
              'flex-shrink-0 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-150 whitespace-nowrap',
              isActive
                ? 'bg-primary text-white shadow-card'
                : 'bg-surface border border-border text-ink-2 hover:border-border-strong hover:bg-surface-3',
            )}
          >
            {icon && (
              <span className={cn('flex-shrink-0', isActive ? 'text-white/80' : 'text-ink-4')}>
                {icon}
              </span>
            )}
            {label}
          </button>
        );
      })}
    </div>
  );
}
