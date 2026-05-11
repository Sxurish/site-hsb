'use client';

import { Moon, Sun } from 'lucide-react';
import { useEffect, useState } from 'react';

export function ThemeToggle() {
  const [dark, setDark] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setDark(document.documentElement.classList.contains('dark'));
  }, []);

  const toggle = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle('dark', next);
    const value = next ? 'dark' : 'light';
    try { localStorage.setItem('theme', value); } catch {}
    document.cookie = `theme=${value}; path=/; max-age=31536000; SameSite=Lax`;
  };

  if (!mounted) return <div className="h-8 w-8" />;

  return (
    <button
      onClick={toggle}
      aria-label="Toggle theme"
      className="flex h-8 w-8 items-center justify-center rounded-full border border-border/[0.12] text-fg/45 transition hover:border-border/25 hover:text-fg"
    >
      {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </button>
  );
}
