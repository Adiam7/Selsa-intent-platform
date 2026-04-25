import Link from 'next/link';
import { ReactNode } from 'react';

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-60 bg-[var(--surface)] border-r border-[var(--border)] p-4 flex flex-col gap-2">
        <div className="text-xl font-bold text-indigo-400 mb-6">⚡ Intent</div>
        
        <nav className="flex-1 space-y-1">
          <NavLink href="/app">Dashboard</NavLink>
          <NavLink href="/app/users">Users</NavLink>
          <NavLink href="/app/segments">Segments</NavLink>
          <NavLink href="/app/analytics">Analytics</NavLink>
          <NavLink href="/app/feed">Live Feed</NavLink>
        </nav>

        {/* User menu at bottom */}
        <div className="border-t border-[var(--border)] pt-4 space-y-2">
          <button className="w-full text-left px-3 py-2 text-sm text-[var(--muted)] hover:bg-[var(--border)] hover:text-[var(--text)] rounded-lg transition-colors">
            Settings
          </button>
          <button className="w-full text-left px-3 py-2 text-sm text-[var(--muted)] hover:bg-[var(--border)] hover:text-[var(--text)] rounded-lg transition-colors">
            Sign out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-6 overflow-auto bg-[var(--bg)]">{children}</main>
    </div>
  );
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="block px-3 py-2 rounded-lg text-sm text-[var(--muted)] hover:bg-[var(--border)] hover:text-[var(--text)] transition-colors"
    >
      {children}
    </Link>
  );
}
