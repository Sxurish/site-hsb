'use client';

import { useState } from 'react';
import { SidebarContext } from './sidebar-context';
import { Sidebar } from './sidebar';

export function LayoutShell({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <SidebarContext.Provider value={{
      open,
      toggle: () => setOpen((v) => !v),
      close: () => setOpen(false),
    }}>
      <div className="flex h-dvh overflow-hidden bg-bg">
        {open && (
          <div
            className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm md:hidden"
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />
        )}
        <Sidebar />
        <main className="flex flex-1 flex-col overflow-hidden md:pl-60">
          {children}
        </main>
      </div>
    </SidebarContext.Provider>
  );
}
