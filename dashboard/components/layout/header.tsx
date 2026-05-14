'use client';

import { Bell, RefreshCw } from 'lucide-react';

interface HeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}

export function Header({ title, subtitle, action }: HeaderProps) {
  const now = new Date();
  const dateStr = now.toLocaleDateString('pt-BR', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  });

  return (
    <div className="flex h-16 shrink-0 items-center justify-between border-b border-border bg-surface/80 px-6 backdrop-blur-sm">
      <div className="min-w-0">
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

        {/* Avatar */}
        <div className="ml-1 flex h-8 w-8 items-center justify-center rounded-full bg-gold-dim ring-1 ring-gold/20">
          <span className="text-xs font-bold text-gold">AL</span>
        </div>
      </div>
    </div>
  );
}
