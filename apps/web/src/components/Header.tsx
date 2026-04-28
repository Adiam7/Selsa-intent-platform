'use client';

import Link from 'next/link';
import { Zap, ChevronDown } from 'lucide-react';

export function Header() {
  return (
    <nav className="border-b border-white/60 bg-white/[0.17] backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg">
            <Zap className="w-4 h-4 text-white fill-white" />
          </div>
          <span className="font-bold text-lg text-gray-900">IntentHub</span>
        </Link>
        <div className="hidden lg:flex items-center gap-8">
          <Link href="#" className="text-sm font-medium text-gray-700 hover:text-gray-900">Product</Link>
          <Link href="#" className="text-sm font-medium text-gray-700 hover:text-gray-900">Solutions</Link>
          <Link href="#" className="text-sm font-medium text-gray-700 hover:text-gray-900">Resources</Link>
          <Link href="#" className="text-sm font-medium text-gray-700 hover:text-gray-900">Pricing</Link>
          <button className="text-sm font-medium text-gray-700 hover:text-gray-900 flex items-center gap-1">
            Company <ChevronDown className="w-4 h-4" />
          </button>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/signin" className="text-sm font-medium text-gray-700 hover:text-gray-900">Log in</Link>
        </div>
      </div>
    </nav>
  );
}
