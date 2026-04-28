'use client';

import { useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import {
  BookOpen,
  Briefcase,
  Compass,
  HandHeart,
  Handshake,
  Heart,
  HelpCircle,
  Lightbulb,
  ShoppingBag,
  UserRound,
} from 'lucide-react';
import { IntentPillSwitcher } from '@/components/IntentPillSwitcher';
import { FeedLayout } from '@/components/FeedLayout';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

const FEED_CONFIG = {
  build_something: {
    name: "Builder's Hub",
    tagline: 'Bring your idea to life.',
    categories: ['Apps & Software', 'Hardware', 'Creative', 'Research'],
    searchPlaceholder: 'Search projects or challenges…',
    actionLabel: 'Start',
    actionVariant: 'primary' as const,
  },
  learn_something: {
    name: 'Learning Feed',
    tagline: 'Grow skills with others',
    categories: ['Study Groups', 'Courses', 'Challenges'],
    searchPlaceholder: 'Search skills, topics, or groups…',
    actionLabel: 'Join',
    actionVariant: 'primary' as const,
  },
  teach_something: {
    name: 'Teaching Opportunities',
    tagline: 'Share knowledge. Impact lives.',
    categories: ['Teaching Requests', 'Tutoring', 'Workshops'],
    searchPlaceholder: 'What would you like to teach?',
    actionLabel: 'Teach',
    actionVariant: 'primary' as const,
  },
  get_help: {
    name: 'Help Requests',
    tagline: 'Ask. Find answers. Solve together.',
    categories: ['Academic', 'Career', 'Technical', 'Life'],
    searchPlaceholder: 'What do you need help with?',
    actionLabel: 'Help',
    actionVariant: 'red' as const,
  },
  give_support: {
    name: 'Support Opportunities',
    tagline: 'Make a difference. Support others.',
    categories: ['Emotional', 'Career', 'Academic', 'Other'],
    searchPlaceholder: 'How would you like to support?',
    actionLabel: 'Support',
    actionVariant: 'ghost' as const,
  },
  find_collaborators: {
    name: 'Collaboration Requests',
    tagline: 'Find the right people to work with.',
    categories: ['Projects', 'Startups', 'Research', 'Creative'],
    searchPlaceholder: 'What are you collaborating on?',
    actionLabel: 'Respond',
    actionVariant: 'primary' as const,
  },
  do_collaboration: {
    name: 'Join Collaborations',
    tagline: 'Join amazing projects and teams.',
    categories: ['Projects', 'Startups', 'Creative', 'Research'],
    searchPlaceholder: 'What would you like to work on?',
    actionLabel: 'Join',
    actionVariant: 'primary' as const,
  },
  sell_something: {
    name: 'Marketplace',
    tagline: 'List and sell what you offer.',
    categories: ['Services', 'Digital Products', 'Physical'],
    searchPlaceholder: 'What are you selling?',
    actionLabel: 'View',
    actionVariant: 'green' as const,
  },
  buy_something: {
    name: 'Discover Products',
    tagline: 'Find exactly what you need.',
    categories: ['Services', 'Digital Products', 'Physical'],
    searchPlaceholder: 'What are you looking for?',
    actionLabel: 'View',
    actionVariant: 'primary' as const,
  },
  explore_ideas: {
    name: 'Ideas Feed',
    tagline: 'Discover, explore, get inspired.',
    categories: ['Startups', 'Products', 'Research', 'Creative'],
    searchPlaceholder: 'Search ideas or topics…',
    actionLabel: 'Explore',
    actionVariant: 'ghost' as const,
  },
};

type IntentKey = keyof typeof FEED_CONFIG;

type Listing = {
  id: string;
  title: string;
  category: string;
  description: string;
  metadata?: Record<string, unknown>;
  created_at?: string;
};

const INTENT_META: Record<IntentKey, { short: string; icon: ReactNode; iconBg: string }> = {
  build_something:    { short: 'Build',              icon: <Lightbulb className="w-4 h-4 text-amber-500" />,     iconBg: 'bg-amber-50'   },
  learn_something:    { short: 'Learn',              icon: <BookOpen className="w-4 h-4 text-blue-500" />,       iconBg: 'bg-blue-50'    },
  teach_something:    { short: 'Teach',              icon: <UserRound className="w-4 h-4 text-green-500" />,     iconBg: 'bg-green-50'   },
  get_help:           { short: 'Get help',           icon: <HelpCircle className="w-4 h-4 text-red-500" />,      iconBg: 'bg-red-50'     },
  give_support:       { short: 'Support',            icon: <Heart className="w-4 h-4 text-rose-500" />,          iconBg: 'bg-rose-50'    },
  find_collaborators: { short: 'Ask Collab',         icon: <Handshake className="w-4 h-4 text-violet-500" />,    iconBg: 'bg-violet-50'  },
  do_collaboration:   { short: 'Join Collab',        icon: <HandHeart className="w-4 h-4 text-indigo-500" />,    iconBg: 'bg-indigo-50'  },
  sell_something:     { short: 'Sell',               icon: <ShoppingBag className="w-4 h-4 text-emerald-500" />, iconBg: 'bg-emerald-50' },
  buy_something:      { short: 'Buy',                icon: <Briefcase className="w-4 h-4 text-teal-500" />,      iconBg: 'bg-teal-50'    },
  explore_ideas:      { short: 'Explore',            icon: <Compass className="w-4 h-4 text-orange-500" />,      iconBg: 'bg-orange-50'  },
};

export default function HomePage() {
  const [selectedIntents] = useState<IntentKey[]>([
    'learn_something',
    'teach_something',
    'get_help',
    'give_support',
    'find_collaborators',
    'do_collaboration',
    'sell_something',
    'buy_something',
    'build_something',
    'explore_ideas',
  ]);
  const [activeIntent, setActiveIntent] = useState<IntentKey>(selectedIntents[0]);
  const [activeCategory, setActiveCategory] = useState('');
  const [cards, setCards] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const feed = FEED_CONFIG[activeIntent];
    if (feed && !activeCategory) {
      setActiveCategory(feed.categories[0]);
    }
  }, [activeIntent, activeCategory]);

  useEffect(() => {
    const fetchListings = async () => {
      if (!activeIntent || !activeCategory) return;
      setLoading(true);
      try {
        const params = new URLSearchParams({
          intent_type: activeIntent,
          category: activeCategory,
          limit: '20',
        });
        const res = await fetch(`/api/listings?${params.toString()}`);
        const data = await res.json();
        setCards(Array.isArray(data) ? data : []);
      } catch {
        setCards([]);
      } finally {
        setLoading(false);
      }
    };
    fetchListings();
  }, [activeIntent, activeCategory]);

  const feedConfig = FEED_CONFIG[activeIntent];
  const currentCategory = activeCategory || feedConfig.categories[0];

  const mappedCards = useMemo(
    () =>
      cards.map((card) => ({
        id: card.id,
        icon: INTENT_META[activeIntent].icon,
        iconBg: INTENT_META[activeIntent].iconBg,
        title: card.title,
        subtitle: card.description,
        tags: [card.category],
        author: typeof card.metadata?.author === 'string' ? card.metadata.author : 'Community',
        timestamp: card.created_at ? 'Recently' : undefined,
        price: typeof card.metadata?.price === 'number' ? card.metadata.price : undefined,
        urgency: typeof card.metadata?.urgency === 'string' ? card.metadata.urgency : undefined,
        actionLabel: feedConfig.actionLabel,
        actionVariant: feedConfig.actionVariant,
      })),
    [cards, activeIntent, feedConfig],
  );

  const intentSwitcher = (
    <IntentPillSwitcher
      intents={selectedIntents.map((id) => ({
        id,
        label: INTENT_META[id].short,
        icon: INTENT_META[id].icon,
      }))}
      activeIntent={activeIntent}
      onIntentChange={(intentId) => {
        if ((selectedIntents as string[]).includes(intentId)) {
          setActiveIntent(intentId as IntentKey);
          setActiveCategory('');
        }
      }}
    />
  );

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 via-pink-50 to-purple-50 flex flex-col">
      <Header />
      <div className="flex-1">
        <FeedLayout
          feedName={feedConfig.name}
          tagline={feedConfig.tagline}
          categories={feedConfig.categories}
          activeCategory={currentCategory}
          onCategoryChange={(cat) => setActiveCategory(cat)}
          searchPlaceholder={feedConfig.searchPlaceholder}
          cards={mappedCards}
          intentSwitcher={intentSwitcher}
          loading={loading}
        />
      </div>
      <Footer />
    </div>
  );
}