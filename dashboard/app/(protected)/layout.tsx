import { UserProvider } from '@/components/auth/user-context';
import { LayoutShell } from '@/components/layout/layout-shell';
import { requireUser } from '@/lib/auth';

export default async function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const user = await requireUser();

  return (
    <UserProvider user={user}>
      <LayoutShell>
        {children}
      </LayoutShell>
    </UserProvider>
  );
}
