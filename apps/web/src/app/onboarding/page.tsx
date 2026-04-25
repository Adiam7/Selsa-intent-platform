'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Lightbulb,
  BookOpen,
  Users,
  HelpCircle,
  Heart,
  Handshake,
  Briefcase,
  ShoppingBag,
  Compass,
  Zap,
} from 'lucide-react';
import { cn } from '@/lib/cn';

const INTENTS = [
  {
    id: 'build_something',
    label: 'Build something',
    description: 'Bring a project or product to life',
    icon: Lightbulb,
    color: 'text-amber-500',
    bg: 'bg-amber-50',
  },
  {
    id: 'learn_something',
    label: 'Learn a skill',
    description: 'Grow with study groups and peers',
    icon: BookOpen,
    color: 'text-blue-500',
    bg: 'bg-blue-50',
  },
  {
    id: 'teach_something',
    label: 'Teach something',
    description: 'Share your knowledge with others',
    icon: Users,
    color: 'text-green-500',
    bg: 'bg-green-50',
  },
  {
    id: 'get_help',
    label: 'Get help',
    description: 'Find people who can assist you',
    icon: HelpCircle,
    color: 'text-red-500',
    bg: 'bg-red-50',
  },
  {
    id: 'give_support',
    label: 'Give support',
    description: 'Support others with your time',
    icon: Heart,
    color: 'text-rose-500',
    bg: 'bg-rose-50',
  },
  {
    id: 'find_collaborators',
    label: 'Find collaborators',
    description: 'Recruit your dream team',
    icon: Handshake,
    color: 'text-violet-500',
    bg: 'bg-violet-50',
  },
  {
    id: 'do_collaboration',
    label: 'Join a project',
    description: 'Work with others on their ideas',
    icon: Briefcase,
    color: 'text-indigo-500',
    bg: 'bg-indigo-50',
  },
  {
    id: 'sell_something',
    label: 'Sell something',
    description: 'List your product or service',
    icon: ShoppingBag,
    color: 'text-emerald-500',
    bg: 'bg-emerald-50',
  },
  {
    id: 'buy_something',
    label: 'Buy something',
    description: 'Discover products and services',
    icon: ShoppingBag,
    color: 'text-teal-500',
    bg: 'bg-teal-50',
  },
  {
    id: 'explore_ideas',
    label: 'Explore ideas',
    description: 'Browse and get inspired',
    icon: Compass,
    color: 'text-orange-500',
    bg: 'bg-orange-50',
  },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [selected, setSelected] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const toggleIntent = (intentId: string) => {
    setSelected((prev) => {
      if (prev.includes(intentId)) return prev.filter((id) => id !== intentId);
      if (prev.length < 5) return [...prev, intentId];
      return prev;
    });
  };

  const handleConfirm = async () => {
    if (selected.length === 0) return;
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/users/me/intents', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ intents: selected }),
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.message || 'Failed to save. Try again.');
        return;
      }

      router.push('/home');
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface-2 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-5 max-w-3xl mx-auto w-full">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
            <Zap className="w-4 h-4 text-white fill-white" />
          </div>
          <span className="font-semibold text-ink tracking-tight">IntentHub</span>
        </div>
        <button
          onClick={() => router.push('/home')}
          className="text-sm text-ink-3 hover:text-ink-2 transition-colors"
        >
          Skip for now
        </button>
      </div>

      {/* Content */}
      <main className="flex-1 max-w-3xl mx-auto w-full px-4 pb-32 pt-8">
        <div className="text-center mb-10 animate-fade-up">
          <h1 className="text-3xl font-bold text-ink tracking-tight mb-2">
            What brings you here?
          </h1>
          <p className="text-ink-3 text-sm">
            Pick up to 5 — we&apos;ll tailor your feed around them.
          </p>
        </div>

        {error && (
          <p className="text-sm text-red-500 bg-red-50 px-4 py-2.5 rounded-md border border-red-100 mb-6 text-center">
            {error}
          </p>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 animate-fade-up" style={{ animationDelay: '60ms' }}>
          {INTENTS.map(({ id, label, description, icon: Icon, color, bg }) => {
            const isSelected = selected.includes(id);
            const isDisabled = !isSelected && selected.length >= 5;

            return (
              <button
                key={id}
                onClick={() => toggleIntent(id)}
                disabled={isDisabled}
                className={cn(
                  'group flex flex-col items-center gap-2.5 p-4 rounded-xl border-2 text-center',
                  'transition-all duration-150 active:scale-[0.97]',
                  isSelected
                    ? 'border-primary bg-primary-soft shadow-card-hover'
                    : isDisabled
                    ? 'border-border bg-surface opacity-40 cursor-not-allowed'
                    : 'border-border bg-surface hover:border-border-strong hover:shadow-card cursor-pointer',
                )}
              >
                <div className={cn('w-10 h-10 rounded-full flex items-center justify-center', isSelected ? 'bg-primary/10' : bg)}>
                  <Icon className={cn('w-5 h-5', isSelected ? 'text-primary' : color)} />
                </div>
                <span className={cn('text-xs font-semibold leading-tight', isSelected ? 'text-primary' : 'text-ink-2')}>
                  {label}
                </span>
                <span className="text-[10px] text-ink-4 leading-tight hidden sm:block">
                  {description}
                </span>
              </button>
            );
          })}
        </div>
      </main>

      {/* Sticky bottom CTA */}
      <div className="fixed bottom-0 left-0 right-0 bg-surface/90 backdrop-blur-md border-t border-border px-4 py-4">
        <div className="max-w-3xl mx-auto flex items-center justify-between gap-4">
          <span className="text-sm text-ink-3">
            {selected.length === 0
              ? 'Select at least one'
              : `${selected.length} of 5 selected`}
          </span>

          <div className="flex gap-2">
            {selected.length > 0 && (
              <div className="flex gap-1 items-center">
                {selected.map((id) => {
                  const intent = INTENTS.find((i) => i.id === id);
                  if (!intent) return null;
                  const Icon = intent.icon;
                  return (
                    <div key={id} className="w-7 h-7 rounded-full bg-primary-soft flex items-center justify-center">
                      <Icon className="w-3.5 h-3.5 text-primary" />
                    </div>
                  );
                })}
              </div>
            )}

            <button
              onClick={handleConfirm}
              disabled={selected.length === 0 || loading}
              className="bg-primary text-white px-6 py-2.5 rounded-md font-semibold text-sm hover:bg-primary-dark active:scale-[0.98] disabled:opacity-50 transition-all duration-150 shadow-card"
            >
              {loading ? 'Saving…' : 'Continue →'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
