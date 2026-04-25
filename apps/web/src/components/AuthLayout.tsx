'use client';

import Link from 'next/link';
import { Zap } from 'lucide-react';
import { ReactNode } from 'react';

interface AuthLayoutProps {
  title: string;
  subtitle: string;
  footer: ReactNode;
  children: ReactNode;
}

export function AuthLayout({ title, subtitle, footer, children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-surface-2 flex flex-col items-center justify-center px-4 py-12">
      {/* Logo */}
      <Link href="/" className="flex items-center gap-2 mb-10 group">
        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shadow-card group-hover:shadow-card-hover transition-shadow duration-150">
          <Zap className="w-4 h-4 text-white fill-white" />
        </div>
        <span className="font-semibold text-ink tracking-tight">IntentHub</span>
      </Link>

      {/* Card */}
      <div className="w-full max-w-sm bg-surface rounded-xl shadow-panel p-8 animate-scale-in">
        <div className="mb-7">
          <h1 className="text-2xl font-bold text-ink tracking-tight">{title}</h1>
          <p className="text-sm text-ink-3 mt-1">{subtitle}</p>
        </div>

        {children}
      </div>

      {/* Footer link */}
      <div className="mt-6 text-sm text-ink-3">{footer}</div>
    </div>
  );
}
