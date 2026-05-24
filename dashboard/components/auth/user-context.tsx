'use client';

import { createContext, useContext } from 'react';
import type { DashboardUser } from '@/lib/auth';

const UserContext = createContext<DashboardUser | null>(null);

export function UserProvider({
  user,
  children,
}: {
  user: DashboardUser;
  children: React.ReactNode;
}) {
  return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
}

export function useUser(): DashboardUser {
  const u = useContext(UserContext);
  if (!u) throw new Error('useUser must be inside <UserProvider> (protected layout)');
  return u;
}
