'use client';

import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { navLinks } from '@/data/site';
import { BrandLogo } from './brand-logo';
import { ThemeToggle } from './theme-toggle';

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-border/[0.08] bg-bg/70 backdrop-blur">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-4 md:px-8">
        <a href="#top" aria-label="HSB Company home">
          <BrandLogo />
        </a>

        <nav className="hidden items-center gap-6 md:flex">
          {navLinks.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-sm text-fg/55 transition hover:text-fg"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <ThemeToggle />
          <motion.a
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            href="#contact"
            className="rounded-full bg-fg px-5 py-2 text-sm font-bold text-bg transition hover:opacity-85"
          >
            Request a Quote
          </motion.a>
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <button
            className="rounded-lg border border-border/[0.12] p-2 text-fg/50"
            aria-label={open ? 'Close menu' : 'Open menu'}
            onClick={() => setOpen((p) => !p)}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="border-t border-border/[0.08] bg-bg/95 px-4 py-4 md:hidden"
          >
            <div className="mx-auto flex max-w-7xl flex-col gap-1">
              {navLinks.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-3 py-2.5 text-sm text-fg/70 transition hover:bg-fg/[0.05] hover:text-fg"
                >
                  {item.label}
                </a>
              ))}
              <a
                href="#contact"
                onClick={() => setOpen(false)}
                className="mt-2 rounded-lg bg-fg px-4 py-2.5 text-center text-sm font-bold text-bg"
              >
                Request a Quote
              </a>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
