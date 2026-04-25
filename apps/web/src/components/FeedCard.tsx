'use client';

import { ReactNode } from 'react';
import { cn } from '@/lib/cn';

interface FeedCardProps {
  icon?: ReactNode;
  iconBg?: string;
  title: string;
  subtitle?: string;
  tags?: string[];
  author?: string;
  timestamp?: string;
  price?: string | number;
  urgency?: string;
  actionLabel: string;
  actionVariant?: 'primary' | 'ghost' | 'green' | 'red';
  onAction?: () => void;
  members?: number;
}

const actionVariantClasses: Record<string, string> = {
  primary: 'bg-primary text-white hover:bg-primary/90',
  ghost: 'bg-surface border border-border text-ink hover:bg-surface-2',
  green: 'bg-green-600 text-white hover:bg-green-700',
  red: 'bg-red-600 text-white hover:bg-red-700',
};

export function FeedCard({
  icon,
  iconBg,
  title,
  subtitle,
  tags,
  author,
  timestamp,
  price,
  urgency,
  actionLabel,
  actionVariant = 'primary',
  onAction,
  members,
}: FeedCardProps) {
  return (
    <div className="bg-surface border border-border rounded-2xl p-4 shadow-card hover:shadow-card-hover transition-shadow">
      <div className="flex gap-3">
        {icon && (
          <div
            className={cn(
              'flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center',
              iconBg ?? 'bg-primary-soft'
            )}
          >
            {icon}
          </div>
        )}

        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-ink line-clamp-1">{title}</h3>

          {subtitle && (
            <p className="text-sm text-ink-3 line-clamp-2 mt-0.5">{subtitle}</p>
          )}

          {tags && tags.length > 0 && (
            <div className="flex gap-1.5 mt-2 flex-wrap">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs bg-surface-2 text-ink-3 border border-border px-2 py-0.5 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          <div className="flex gap-3 mt-2 text-xs text-ink-4">
            {author && <span>{author}</span>}
            {timestamp && <span>{timestamp}</span>}
            {members && <span>{members} members</span>}
          </div>

          {urgency && (
            <div className="mt-1.5 flex items-center gap-1.5 text-xs text-red-600 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 inline-block" />
              {urgency}
            </div>
          )}
        </div>

        <div className="flex-shrink-0 flex flex-col items-end gap-2">
          {price && (
            <span className="text-sm font-semibold text-ink">
              ${price}
            </span>
          )}

          <button
            onClick={(e) => { e.stopPropagation(); onAction?.(); }}
            className={cn(
              'px-3.5 py-1.5 rounded-full text-sm font-medium transition',
              actionVariantClasses[actionVariant]
            )}
          >
            {actionLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
