'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  Filter,
  Lightbulb,
  Target,
  BarChart2,
  LogOut,
  Settings,
  ChevronRight,
} from 'lucide-react';

const NAV_ITEMS = [
  { href: '/overview',  label: 'Dashboard',  icon: LayoutDashboard },
  { href: '/leads',     label: 'Leads',       icon: Users           },
  { href: '/funnel',    label: 'Funil',       icon: Filter          },
  { href: '/insights',  label: 'Insights',    icon: Lightbulb       },
  { href: '/goals',     label: 'Metas',       icon: Target          },
  { href: '/reports',   label: 'Relatórios',  icon: BarChart2       },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.replace('/login');
  };

  return (
    <aside className="fixed inset-y-0 left-0 z-40 flex w-60 flex-col border-r border-border bg-surface">
      {/* Logo */}
      <div className="flex h-16 shrink-0 items-center border-b border-border px-5">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gold-dim ring-1 ring-gold/20">
            <span className="text-sm font-black tracking-tighter text-gold">H</span>
          </div>
          <div className="leading-none">
            <p className="text-sm font-bold text-ink">HSB Company</p>
            <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-muted">Dashboard</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-0.5 overflow-y-auto px-2 py-4">
        <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-[0.2em] text-muted">Principal</p>
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(href + '/');
          return (
            <Link
              key={href}
              href={href}
              className={`group flex items-center justify-between rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-150 ${
                active
                  ? 'bg-gold-dim text-gold shadow-glow-sm'
                  : 'text-muted hover:bg-surface-2 hover:text-ink'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={`h-4 w-4 shrink-0 ${active ? 'text-gold' : 'text-muted group-hover:text-ink'}`}
                  strokeWidth={active ? 2 : 1.8}
                />
                {label}
              </div>
              {active && <ChevronRight className="h-3 w-3 text-gold/60" />}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-border px-2 py-3 space-y-0.5">
        <Link href="/settings" className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted hover:bg-surface-2 hover:text-ink transition-all">
          <Settings className="h-4 w-4" strokeWidth={1.8} />
          Configurações
        </Link>
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted hover:bg-danger/10 hover:text-danger transition-all"
        >
          <LogOut className="h-4 w-4" strokeWidth={1.8} />
          Sair
        </button>
      </div>
    </aside>
  );
}
