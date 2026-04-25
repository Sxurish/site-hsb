'use client';

import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { navLinks } from '@/data/site';
import { BrandLogo } from './brand-logo';

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-800 bg-slate-950/95 backdrop-blur">
      <div className="container-shell flex items-center justify-between py-4">
        <a href="#top" aria-label="HSB home">
          <BrandLogo compact />
        </a>

        <nav className="hidden items-center gap-6 md:flex">
          {navLinks.map((item) => (
            <a key={item.href} href={item.href} className="text-sm text-slate-300 transition hover:text-white">
              {item.label}
            </a>
          ))}
        </nav>

        <a href="#contact" className="hidden rounded-lg bg-white px-4 py-2 text-sm font-semibold text-slate-900 md:inline-flex">
          Request a Quote
        </a>

        <button className="rounded-md border border-slate-700 p-2 md:hidden" onClick={() => setOpen((v) => !v)} aria-label="Toggle menu">
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      <AnimatePresence>
        {open ? (
          <motion.nav initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="border-t border-slate-800 bg-slate-950 md:hidden">
            <div className="container-shell flex flex-col gap-1 py-3">
              {navLinks.map((item) => (
                <a key={item.href} href={item.href} onClick={() => setOpen(false)} className="rounded-md px-3 py-2 text-sm text-slate-300 hover:bg-slate-900 hover:text-white">
                  {item.label}
                </a>
              ))}
            </div>
          </motion.nav>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
