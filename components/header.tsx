'use client';

import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { navLinks } from '@/data/site';
import { BrandLogo } from './brand-logo';

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-surface/70 backdrop-blur">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-4 md:px-8">
        <a href="#top" aria-label="HSB Company home">
          <BrandLogo />
        </a>

        <nav className="hidden items-center gap-6 md:flex">
          {navLinks.map((item) => (
            <a key={item.href} href={item.href} className="text-sm text-white/75 transition hover:text-white">
              {item.label}
            </a>
          ))}
        </nav>

        <motion.a
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
          href="#contact"
          className="hidden rounded-full px-5 py-2 text-sm font-bold text-black md:inline-flex"
          style={{ background: 'linear-gradient(90deg, #E91E8C, #FF6B2C)' }}
        >
          Request a Quote
        </motion.a>

        <button
          className="rounded-lg border border-white/20 p-2 md:hidden"
          aria-label={open ? 'Close menu' : 'Open menu'}
          onClick={() => setOpen((prev) => !prev)}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      <AnimatePresence>
        {open ? (
          <motion.nav
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="border-t border-white/10 bg-black/95 px-4 py-4 md:hidden"
          >
            <div className="mx-auto flex max-w-7xl flex-col gap-2">
              {navLinks.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-3 py-2 text-sm text-white/80 transition hover:bg-white/10 hover:text-white"
                >
                  {item.label}
                </a>
              ))}
              <a
                href="#contact"
                onClick={() => setOpen(false)}
                className="mt-2 rounded-lg px-4 py-2 text-center text-sm font-bold text-black"
                style={{ background: 'linear-gradient(90deg, #E91E8C, #FF6B2C)' }}
              >
                Request a Quote
              </a>
            </div>
          </motion.nav>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
