'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Compass, Sparkles, Users, Zap } from 'lucide-react';

const INTENT_CHIPS = [
  'Build something',
  'Learn a skill',
  'Find collaborators',
  'Sell a service',
  'Explore ideas',
];

const TYPING_WORDS = ['builders', 'learners', 'creators', 'founders'];

const SURFACE_CARDS = [
  {
    icon: Users,
    title: 'Match Quality First',
    body: 'See people and listings that align with your intent, not random noise.',
  },
  {
    icon: Compass,
    title: 'Clear Next Actions',
    body: 'Every screen has one obvious next step so users never feel stuck.',
  },
  {
    icon: Sparkles,
    title: 'Calm, Fast Interface',
    body: 'Subtle motion and sharp hierarchy make discovery feel effortless.',
  },
];

export default function SplashPage() {
  const [activeWordIndex, setActiveWordIndex] = useState(0);
  const [typedText, setTypedText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentWord = TYPING_WORDS[activeWordIndex];
    const typingSpeed = isDeleting ? 42 : 78;

    const timer = setTimeout(() => {
      if (!isDeleting && typedText.length < currentWord.length) {
        setTypedText(currentWord.slice(0, typedText.length + 1));
        return;
      }

      if (isDeleting && typedText.length > 0) {
        setTypedText(currentWord.slice(0, typedText.length - 1));
        return;
      }

      if (!isDeleting && typedText.length === currentWord.length) {
        setTimeout(() => setIsDeleting(true), 900);
        return;
      }

      setIsDeleting(false);
      setActiveWordIndex((prev) => (prev + 1) % TYPING_WORDS.length);
    }, typingSpeed);

    return () => clearTimeout(timer);
  }, [activeWordIndex, isDeleting, typedText]);

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-36 -left-32 h-80 w-80 rounded-full bg-cyan-400/20 blur-3xl animate-pulse" />
        <div className="absolute top-40 -right-28 h-[28rem] w-[28rem] rounded-full bg-purple-400/20 blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 h-64 w-64 rounded-full bg-pink-400/15 blur-3xl animate-pulse" style={{ animationDelay: '4s' }} />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:60px_60px]" />
      </div>

      {/* Nav */}
      <nav className="sticky top-0 z-20 border-b border-white/10 backdrop-blur-xl bg-white/10">
        <div className="flex items-center justify-between px-6 py-4 max-w-6xl mx-auto w-full">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-white/20 backdrop-blur-sm border border-white/20 flex items-center justify-center shadow-2xl">
              <Zap className="w-4 h-4 text-white fill-white" />
            </div>
            <span className="font-semibold tracking-tight text-[15px] text-white">IntentHub</span>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/signin"
              className="text-sm font-medium text-white/80 hover:text-white transition-colors duration-150"
            >
              Sign in
            </Link>
            <Link
              href="/signup"
              className="hidden sm:inline-flex items-center rounded-full border border-white/20 bg-white/10 backdrop-blur-md px-4 py-2 text-sm font-semibold text-white hover:border-white/30 hover:bg-white/20 transition-all shadow-lg"
            >
              Start free
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <main className="relative z-10 max-w-6xl mx-auto w-full px-6 pt-16 pb-14">
        {/* Eyebrow */}
        {/* <div className="animate-fade-in flex justify-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/85 px-3.5 py-1.5 text-[11px] font-semibold tracking-[0.11em] text-ink-2 uppercase shadow-sm">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Guided discovery, now in beta
          </div>
        </div> */}

        {/* Headline */}
        <div className="mx-auto max-w-4xl text-center mt-8">
          <h1
            className="animate-fade-up text-[2.35rem] sm:text-6xl lg:text-7xl font-semibold tracking-[-0.03em] leading-[1.03]"
            style={{ animationDelay: '60ms' }}
          >
            Everything you want to do 
            <br />
            <span className="text-black">with right people </span>
            <span className="bg-gradient-to-r from-cyan-600 via-sky-600 to-emerald-600 bg-clip-text text-transparent">
              {typedText}
            </span>
            <span className="ml-1 inline-block h-[1.02em] w-[2px] translate-y-1 bg-ink animate-pulse" />
          </h1>
        </div>

        {/* Sub */}
        <p
          className="animate-fade-up text-[1.05rem] text-ink-3 max-w-2xl mx-auto mb-10 mt-7 leading-relaxed text-center"
          style={{ animationDelay: '120ms' }}
        >
          Declare your intent in seconds. Find the right collaborators, customers,
          and mentors with a flow designed for clarity, speed, and trust.
        </p>

        {/* CTA */}
        <div
          className="animate-fade-up flex flex-col sm:flex-row items-center justify-center gap-3 w-full sm:w-auto"
          style={{ animationDelay: '180ms' }}
        >
          <Link
            href="/signup"
            className="group inline-flex items-center justify-center gap-2 rounded-full bg-white/20 backdrop-blur-md border border-white/20 text-white px-7 py-3.5 font-semibold text-sm shadow-2xl hover:bg-white/30 hover:border-white/30 hover:shadow-3xl hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-300"
          >
            Get started free
            <ArrowRight className="w-4 h-4 transition-transform duration-150 group-hover:translate-x-0.5" />
          </Link>
          <Link
            href="/signin"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white/90 px-7 py-3.5 font-semibold text-sm hover:bg-white/20 hover:border-white/30 active:scale-[0.98] transition-all duration-300 shadow-lg"
          >
            I have an account
          </Link>
        </div>

        {/* Intent chips */}
        {/* <div
          className="animate-fade-up mt-12 flex flex-wrap justify-center gap-2"
          style={{ animationDelay: '240ms' }}
        >
          {INTENT_CHIPS.map((chip) => (
            <span
              key={chip}
              className="px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 text-white text-sm font-medium rounded-full shadow-lg hover:bg-white/20 hover:border-white/30 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 cursor-pointer"
            >
              {chip}
            </span>
          ))}
        </div> */}

        {/* UX blocks */}
        {/* <section className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-4">
          {SURFACE_CARDS.map((card, i) => {
            const Icon = card.icon;
            return (
              <article
                key={card.title}
                className="animate-fade-up group rounded-2xl border border-white/20 bg-white/10 backdrop-blur-md p-6 text-left transition-all duration-300 hover:bg-white/15 hover:border-white/30 hover:shadow-2xl hover:-translate-y-1"
                style={{ animationDelay: `${280 + i * 70}ms` }}
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-white/20 to-white/10 backdrop-blur-sm border border-white/20 text-white flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="font-semibold text-lg text-white tracking-tight mb-2">{card.title}</h3>
                <p className="text-sm text-white/80 leading-relaxed">{card.body}</p>
              </article>
            );
          })}
        </section> */}
      </main>

      {/* Footer */}
      <footer className="relative z-10 text-center pb-8 text-xs text-white/60">
        © 2026 Selsa IntentHub · Built for makers, learners & doers
      </footer>
    </div>
  );
}
