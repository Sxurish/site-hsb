'use client';

import { Bell, RefreshCw, Menu } from 'lucide-react';
import { useUser } from '@/components/auth/user-context';
import { useSidebar } from './sidebar-context';

interface HeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}

function initials(name: string | null, email: string): string {
  if (name) {
    const parts = name.trim().split(/\s+/);
    return ((parts[0]?.[0] ?? '') + (parts[parts.length - 1]?.[0] ?? '')).toUpperCase() || '?';
  }
  return (email[0] ?? '?').toUpperCase();
}

export function Header({ title, subtitle, action }: HeaderProps) {
  const user = useUser();
  const { toggle } = useSidebar();
  const now = new Date();
  const dateStr = now.toLocaleDateString('pt-BR', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  });

  return (
    <div className="flex h-16 shrink-0 items-center justify-between border-b border-border bg-surface/80 px-4 sm:px-6 backdrop-blur-sm">
      {/* Hamburger — apenas mobile */}
      <button
        onClick={toggle}
        aria-label="Abrir menu"
        className="mr-2 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-muted hover:bg-surface-2 hover:text-ink transition-colors md:hidden"
      >
        <Menu className="h-5 w-5" />
      </button>

      <div className="min-w-0 flex-1">
        <h1 className="truncate text-base font-bold text-ink">{title}</h1>
        {subtitle && (
          <p className="text-xs text-muted">{subtitle}</p>
        )}
      </div>

      <div className="flex items-center gap-2">
        {action}

        <span className="hidden text-xs text-muted lg:block capitalize">{dateStr}</span>

        <button
          className="flex h-8 w-8 items-center justify-center rounded-lg text-muted transition-colors hover:bg-surface-2 hover:text-ink"
          title="Atualizar dados"
          onClick={() => window.location.reload()}
        >
          <RefreshCw className="h-3.5 w-3.5" />
        </button>

        <button className="relative flex h-8 w-8 items-center justify-center rounded-lg text-muted transition-colors hover:bg-surface-2 hover:text-ink">
          <Bell className="h-3.5 w-3.5" />
          <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-gold ring-1 ring-surface" />
        </button>

        <div
          className="ml-1 flex h-8 w-8 items-center justify-center rounded-full bg-gold-dim ring-1 ring-gold/20"
          title={`${user.full_name ?? user.email} (${user.role})`}
        >
          <span className="text-xs font-bold text-gold">{initials(user.full_name, user.email)}</span>
        </div>
      </div>
    </div>
  );
}
