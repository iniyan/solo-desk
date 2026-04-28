'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { clsx } from 'clsx';
import {
  LayoutDashboard,
  CheckSquare,
  Inbox,
  CalendarClock,
  Building2,
  FileText,
  BarChart3,
  Settings,
  LogOut,
} from 'lucide-react';

const NAV_ITEMS = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/tasks', label: 'Tasks', icon: CheckSquare },
  { href: '/inbox', label: 'Inbox', icon: Inbox },
  { href: '/planner', label: 'Planner', icon: CalendarClock },
  { href: '/organizations', label: 'Organizations', icon: Building2 },
  { href: '/templates', label: 'Templates', icon: FileText },
  { href: '/review', label: 'Review', icon: BarChart3 },
];

const BOTTOM_ITEMS = [
  { href: '/settings', label: 'Settings', icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-60 h-screen flex flex-col bg-sidebar-bg border-r border-border-subtle fixed left-0 top-0 z-30">
      <div className="px-5 py-5">
        <h1 className="text-lg font-semibold tracking-tight text-text-primary">
          SOLO DESK
        </h1>
        <p className="text-[11px] text-text-secondary mt-0.5">
          Your freelance workday, under control.
        </p>
      </div>

      <nav className="flex-1 px-3 space-y-0.5">
        {NAV_ITEMS.map(item => {
          const isActive = pathname === item.href ||
            (item.href !== '/' && pathname.startsWith(item.href));
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={clsx(
                'flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] font-medium transition-colors',
                isActive
                  ? 'bg-sidebar-active text-text-primary'
                  : 'text-text-secondary hover:bg-sidebar-hover hover:text-text-primary'
              )}
            >
              <Icon size={18} strokeWidth={1.8} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="px-3 pb-4 space-y-0.5">
        {BOTTOM_ITEMS.map(item => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={clsx(
                'flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] font-medium transition-colors',
                isActive
                  ? 'bg-sidebar-active text-text-primary'
                  : 'text-text-secondary hover:bg-sidebar-hover hover:text-text-primary'
              )}
            >
              <Icon size={18} strokeWidth={1.8} />
              {item.label}
            </Link>
          );
        })}
        <button
          onClick={async () => {
            await fetch('/api/auth/logout', { method: 'POST' });
            window.location.href = '/login';
          }}
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] font-medium transition-colors text-text-secondary hover:bg-sidebar-hover hover:text-text-primary w-full"
        >
          <LogOut size={18} strokeWidth={1.8} />
          Logout
        </button>
      </div>
    </aside>
  );
}
