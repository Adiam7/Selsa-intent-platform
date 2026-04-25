'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Check, Zap } from 'lucide-react';
import { cn } from '@/lib/cn';
import {
  Lightbulb, GraduationCap, BookOpen, HandHeart, HelpCircle, Heart,
  Handshake, Briefcase, ShoppingBag, ShoppingCart, Rocket,
} from 'lucide-react';

const INTENT_META: Record<string, { icon: React.ElementType; color: string; bg: string; label: string; desc: string }> = {
  build_something:    { icon: Rocket,     color: 'text-amber-500',   bg: 'bg-amber-50',   label: 'Build',                    desc: 'Share a project you need help with' },
  learn_something:    { icon: GraduationCap,   color: 'text-blue-500',    bg: 'bg-blue-50',    label: 'Learn a skill',            desc: 'Find a study group or course' },
  teach_something:    { icon: BookOpen,      color: 'text-green-500',   bg: 'bg-green-50',   label: 'Teach',                    desc: 'Offer your expertise to others' },
  get_help:           { icon: HelpCircle, color: 'text-red-500',     bg: 'bg-red-50',     label: 'Get help',                 desc: 'Ask a question or get support' },
  give_support:       { icon: HandHeart,      color: 'text-rose-500',    bg: 'bg-rose-50',    label: 'Give support',             desc: 'Offer your time and help' },
  find_collaborators: { icon: Briefcase,   color: 'text-violet-500',  bg: 'bg-violet-50',  label: 'Ask for Collaboration',    desc: 'Post your idea — invite others to join' },
  do_collaboration:   { icon: Handshake,  color: 'text-indigo-500',  bg: 'bg-indigo-50',  label: 'Join Collaboration',       desc: 'Accept an open proposal or project' },
  sell_something:     { icon: ShoppingBag,color: 'text-emerald-500', bg: 'bg-emerald-50', label: 'Sell',                     desc: 'List a product or service' },
  buy_something:      { icon: ShoppingCart,color: 'text-teal-500',    bg: 'bg-teal-50',    label: 'Buy',                      desc: 'Post what you\'re looking for' },
  explore_ideas:      { icon: Lightbulb,  color: 'text-orange-500',  bg: 'bg-orange-50',  label: 'Explore ideas',            desc: 'Share a concept or insight' },
};

// Custom display order: Build sits right before Explore ideas
const CREATE_INTENT_ORDER = [
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
] as const;

const INTENT_FORM_FIELDS: Record<string, Array<{ name: string; label: string; type: 'text' | 'textarea' | 'number'; placeholder?: string; required?: boolean }>> = {
  build_something:    [{ name: 'title', label: 'Project title', type: 'text', placeholder: 'e.g. AI writing assistant', required: true }, { name: 'category', label: 'Category', type: 'text', placeholder: 'e.g. Apps & Software', required: true }, { name: 'description', label: 'What are you building?', type: 'textarea', placeholder: 'Describe your project…', required: true }, { name: 'looking_for', label: "What are you looking for?", type: 'text', placeholder: 'e.g. Co-founder, designer…' }],
  learn_something:    [{ name: 'title', label: 'What do you want to learn?', type: 'text', placeholder: 'e.g. Machine learning basics', required: true }, { name: 'category', label: 'Category', type: 'text', placeholder: 'e.g. Courses', required: true }, { name: 'description', label: 'Tell us more', type: 'textarea', placeholder: 'Your current level, goals…', required: true }, { name: 'duration', label: 'Time commitment (hours/week)', type: 'number', placeholder: '5' }],
  teach_something:    [{ name: 'title', label: 'Topic to teach', type: 'text', placeholder: 'e.g. React for beginners', required: true }, { name: 'category', label: 'Format', type: 'text', placeholder: 'e.g. Workshops', required: true }, { name: 'description', label: 'What will learners gain?', type: 'textarea', placeholder: 'Outcomes and approach…', required: true }, { name: 'experience_level', label: 'Your experience level', type: 'text', placeholder: 'e.g. 5 years, senior dev' }],
  get_help:           [{ name: 'title', label: 'What do you need help with?', type: 'text', placeholder: 'Brief title of your issue', required: true }, { name: 'category', label: 'Area', type: 'text', placeholder: 'e.g. Technical', required: true }, { name: 'description', label: 'Describe the issue', type: 'textarea', placeholder: 'What have you tried?', required: true }, { name: 'urgency', label: 'Urgency', type: 'text', placeholder: 'e.g. Urgent, this week' }],
  give_support:       [{ name: 'title', label: 'Support offer title', type: 'text', placeholder: 'e.g. Career advice for developers', required: true }, { name: 'category', label: 'Type of support', type: 'text', placeholder: 'e.g. Career', required: true }, { name: 'description', label: 'How can you help?', type: 'textarea', placeholder: 'Details about your support…', required: true }, { name: 'availability', label: 'Availability', type: 'text', placeholder: 'e.g. Weekends, 2hr/week' }],
  find_collaborators: [{ name: 'title', label: 'Project or team name', type: 'text', placeholder: 'e.g. HealthTrack startup', required: true }, { name: 'category', label: 'Project type', type: 'text', placeholder: 'e.g. Startups', required: true }, { name: 'description', label: "Who are you looking for?", type: 'textarea', placeholder: 'Skills needed, project stage…', required: true }, { name: 'roles_needed', label: 'Roles needed', type: 'text', placeholder: 'e.g. Full-stack dev, designer' }],
  do_collaboration:   [{ name: 'title', label: 'Collaboration opportunity', type: 'text', placeholder: 'e.g. Open source CLI tool', required: true }, { name: 'category', label: 'Category', type: 'text', placeholder: 'e.g. Projects', required: true }, { name: 'description', label: 'Project details', type: 'textarea', placeholder: 'What would you contribute?', required: true }, { name: 'team_size', label: 'Current team size', type: 'number', placeholder: '3' }],
  sell_something:     [{ name: 'title', label: 'Product or service name', type: 'text', placeholder: 'e.g. Logo design package', required: true }, { name: 'category', label: 'Category', type: 'text', placeholder: 'e.g. Services', required: true }, { name: 'description', label: 'Description', type: 'textarea', placeholder: "What's included?", required: true }, { name: 'price', label: 'Price ($)', type: 'number', placeholder: '99' }],
  buy_something:      [{ name: 'title', label: 'What do you want to buy?', type: 'text', placeholder: 'e.g. React dev for 10h project', required: true }, { name: 'category', label: 'Category', type: 'text', placeholder: 'e.g. Services', required: true }, { name: 'description', label: 'Requirements', type: 'textarea', placeholder: 'Details and expectations…', required: true }, { name: 'budget', label: 'Budget ($)', type: 'number', placeholder: '500' }],
  explore_ideas:      [{ name: 'title', label: 'Idea title', type: 'text', placeholder: 'e.g. AI for elder care', required: true }, { name: 'category', label: 'Category', type: 'text', placeholder: 'e.g. Startups', required: true }, { name: 'description', label: 'Idea summary', type: 'textarea', placeholder: 'What is the idea? Why now?', required: true }, { name: 'goal', label: 'Desired outcome', type: 'text', placeholder: 'e.g. Validate the concept' }],
  default:            [{ name: 'title', label: 'Title', type: 'text', required: true }, { name: 'category', label: 'Category', type: 'text', required: true }, { name: 'description', label: 'Description', type: 'textarea', required: true }],
};

export default function CreateListingPage() {
  const router = useRouter();
  const [step, setStep] = useState<'intent' | 'form'>('intent');
  const [selectedIntent, setSelectedIntent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState<Record<string, string>>({});

  const handleIntentSelect = (intent: string) => {
    setSelectedIntent(intent);
    setStep('form');
    setFormData({});
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { title, category, description, ...metadata } = formData;
      const response = await fetch('/api/listings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ intent_type: selectedIntent, title, category, description, metadata }),
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.message || 'Failed to create listing');
        return;
      }

      router.push('/home');
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  /* ── Step 1: Intent selection ─────────────────────────────── */
  if (step === 'intent') {
    return (
      <div className="min-h-screen bg-surface-2">
        {/* Top bar */}
        <div className="bg-surface/90 backdrop-blur-md border-b border-border sticky top-0 z-10">
          <div className="max-w-2xl mx-auto px-4 py-4 flex items-center gap-3">
            <button
              onClick={() => router.push('/home')}
              className="p-2 -ml-2 rounded-lg text-ink-3 hover:text-ink hover:bg-surface-3 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <p className="font-bold text-ink text-sm">Create a listing</p>
              <p className="text-[11px] text-ink-4">Step 1 of 2 · Choose what you want to post</p>
            </div>
          </div>
        </div>

        <div className="max-w-2xl mx-auto px-4 pt-6 pb-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {CREATE_INTENT_ORDER.map((intent) => {
              const meta = INTENT_META[intent];
              if (!meta) return null;
              const Icon = meta.icon;
              return (
                <button
                  key={intent}
                  onClick={() => handleIntentSelect(intent)}
                  className="group flex items-center gap-3.5 p-4 bg-surface border border-border rounded-xl text-left hover:border-primary/40 hover:bg-primary-soft hover:shadow-card transition-all duration-150 active:scale-[0.98]"
                >
                  <div className={cn('w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0', meta.bg)}>
                    <Icon className={cn('w-5 h-5', meta.color)} />
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-sm text-ink">{meta.label}</p>
                    <p className="text-xs text-ink-4 truncate">{meta.desc}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  /* ── Step 2: Form ─────────────────────────────────────────── */
  const intentMeta = INTENT_META[selectedIntent];
  const fields = INTENT_FORM_FIELDS[selectedIntent] || INTENT_FORM_FIELDS.default;

  return (
    <div className="min-h-screen bg-surface-2">
      {/* Top bar */}
      <div className="bg-surface/90 backdrop-blur-md border-b border-border sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center gap-3">
          <button
            onClick={() => setStep('intent')}
            className="p-2 -ml-2 rounded-lg text-ink-3 hover:text-ink hover:bg-surface-3 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2 flex-1 min-w-0">
            {intentMeta && (
              <div className={cn('w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0', intentMeta.bg)}>
                <intentMeta.icon className={cn('w-3.5 h-3.5', intentMeta.color)} />
              </div>
            )}
            <div className="min-w-0">
              <p className="font-bold text-ink text-sm truncate">
                {intentMeta?.label ?? selectedIntent.replace(/_/g, ' ')}
              </p>
              <p className="text-[11px] text-ink-4">Step 2 of 2 · Fill in the details</p>
            </div>
          </div>
          {/* Step indicator */}
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <div className="w-2 h-2 rounded-full bg-border-strong" />
            <div className="w-2 h-2 rounded-full bg-primary" />
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 pt-6 pb-24">
        {error && (
          <p className="text-sm text-red-500 bg-red-50 px-3 py-2.5 rounded-md border border-red-100 mb-5">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {fields.map((field) => (
            <div key={field.name} className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-ink-2">
                {field.label}
                {field.required && <span className="text-red-400 ml-0.5">*</span>}
              </label>

              {field.type === 'textarea' ? (
                <textarea
                  name={field.name}
                  value={formData[field.name] || ''}
                  onChange={handleInputChange}
                  required={field.required}
                  placeholder={field.placeholder}
                  rows={4}
                  className="w-full px-3.5 py-2.5 bg-surface-2 border border-border rounded-md text-sm text-ink placeholder:text-ink-4 focus:bg-surface focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-150 resize-none"
                />
              ) : (
                <input
                  type={field.type}
                  name={field.name}
                  value={formData[field.name] || ''}
                  onChange={handleInputChange}
                  required={field.required}
                  placeholder={field.placeholder}
                  className="w-full px-3.5 py-2.5 bg-surface-2 border border-border rounded-md text-sm text-ink placeholder:text-ink-4 focus:bg-surface focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-150"
                />
              )}
            </div>
          ))}

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-primary text-white py-3 rounded-md font-semibold text-sm hover:bg-primary-dark active:scale-[0.99] disabled:opacity-60 transition-all duration-150 shadow-card"
            >
              {loading ? (
                'Posting…'
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  Post listing
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Bottom logo bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-surface/95 backdrop-blur-md border-t border-border px-4 py-3">
        <div className="max-w-2xl mx-auto flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-primary flex items-center justify-center">
            <Zap className="w-3 h-3 text-white fill-white" />
          </div>
          <span className="text-xs text-ink-4">Your listing will be visible on the matching feed</span>
        </div>
      </div>
    </div>
  );
}

