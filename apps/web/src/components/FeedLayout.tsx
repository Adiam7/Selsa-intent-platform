'use client';

import { ReactNode, useState } from 'react';
import { Search, Home, Compass, PlusSquare, User } from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';
import { FeedCard } from './FeedCard';
import { cn } from '@/lib/cn';

interface FeedLayoutProps {
  feedName: string;
  tagline: string;
  categories: string[];
  activeCategory: string;
  onCategoryChange: (category: string) => void;
  searchPlaceholder: string;
  cards: Array<{
    id: string;
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
  }>;
  intentSwitcher?: ReactNode;
  loading?: boolean;
}

export function FeedLayout({
  feedName,
  tagline,
  categories,
  activeCategory,
  onCategoryChange,
  searchPlaceholder,
  cards,
  intentSwitcher,
  loading,
}: FeedLayoutProps) {
  const [search, setSearch] = useState('');
  const router = useRouter();
  const pathname = usePathname();

  const NAV = [
    { label: 'Home',    icon: Home,       href: '/home'    },
    { label: 'Explore', icon: Compass,    href: '/explore'  },
    { label: 'Create',  icon: PlusSquare, href: '/create', primary: true },
    { label: 'Profile', icon: User,       href: '/profile'  },
  ];

  const filteredCards = search.trim()
    ? cards.filter(
        (c) =>
          c.title.toLowerCase().includes(search.toLowerCase()) ||
          c.subtitle?.toLowerCase().includes(search.toLowerCase()),
      )
    : cards;

  return (
    <div className="min-h-screen bg-surface-2 pb-24">
      {/* Sticky header */}
      <div className="sticky top-0 z-20 bg-surface/90 backdrop-blur-md border-b border-border">
        <div className="max-w-2xl mx-auto px-4">
          {intentSwitcher && (
            <div className="pt-4 pb-2">{intentSwitcher}</div>
          )}

          <div className="py-3 flex items-center gap-3">
            <div className="flex-1 min-w-0">
              <p className="text-[11px] font-semibold uppercase tracking-widest text-ink-4">
                {feedName}
              </p>
              <p className="text-base font-bold text-ink leading-tight truncate">{tagline}</p>
            </div>
          </div>

          <div className="relative mb-3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-4 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={searchPlaceholder}
              className="w-full pl-9 pr-4 py-2 bg-surface-3 border border-transparent rounded-lg text-sm text-ink placeholder:text-ink-4 focus:bg-surface focus:border-primary focus:ring-2 focus:ring-primary/15 transition-all duration-150"
            />
          </div>

          <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-3">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => onCategoryChange(category)}
                className={cn(
                  'flex-shrink-0 px-3 py-1 rounded-full text-xs font-semibold transition-all duration-150 whitespace-nowrap',
                  activeCategory === category
                    ? 'bg-ink text-surface shadow-card'
                    : 'bg-surface border border-border text-ink-3 hover:border-border-strong',
                )}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Feed */}
      <div className="max-w-2xl mx-auto px-4 pt-4">
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-surface border border-border rounded-xl p-4 animate-pulse"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <div className="flex gap-3.5">
                  <div className="w-9 h-9 rounded-full bg-surface-3 flex-shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3.5 bg-surface-3 rounded-full w-3/4" />
                    <div className="h-3 bg-surface-3 rounded-full w-full" />
                    <div className="h-3 bg-surface-3 rounded-full w-2/3" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredCards.length > 0 ? (
          <div className="space-y-2.5">
            {filteredCards.map((card, i) => (
              <div
                key={card.id}
                className="animate-fade-up"
                style={{ animationDelay: `${i * 40}ms` }}
              >
                <FeedCard
                  icon={card.icon}
                  iconBg={card.iconBg}
                  title={card.title}
                  subtitle={card.subtitle}
                  tags={card.tags}
                  author={card.author}
                  timestamp={card.timestamp}
                  price={card.price}
                  urgency={card.urgency}
                  actionLabel={card.actionLabel}
                  actionVariant={card.actionVariant}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center animate-fade-in">
            <div className="w-14 h-14 rounded-2xl bg-primary-soft flex items-center justify-center mb-4">
              <Search className="w-6 h-6 text-primary" />
            </div>
            <p className="font-semibold text-ink text-sm">Nothing here yet</p>
            <p className="text-xs text-ink-4 mt-1">Be the first to post in this space</p>
          </div>
        )}
      </div>

      {/* Bottom Nav */}
      <div className="fixed bottom-0 left-0 right-0 bg-surface/95 backdrop-blur-md border-t border-border z-20">
        <div className="max-w-2xl mx-auto px-4">
          <div className="flex justify-around py-2">
            {NAV.map(({ label, icon: Icon, href, primary }) => {
              const isActive = pathname === href;
              return (
                <button
                  key={href}
                  onClick={() => router.push(href)}
                  className={cn(
                    'flex flex-col items-center gap-1 px-4 py-1.5 rounded-xl transition-all duration-150',
                    primary
                      ? 'bg-primary text-white px-5 shadow-card hover:bg-primary-dark'
                      : isActive
                      ? 'text-primary'
                      : 'text-ink-4 hover:text-ink-2',
                  )}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-[10px] font-medium">{label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}