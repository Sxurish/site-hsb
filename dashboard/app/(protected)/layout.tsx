import { Sidebar } from '@/components/layout/sidebar';
import { UserProvider } from '@/components/auth/user-context';
import { requireUser } from '@/lib/auth';

export default async function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const user = await requireUser();

  return (
    <UserProvider user={user}>
      <div className="flex h-screen overflow-hidden bg-bg">
        <Sidebar />
        <main className="flex flex-1 flex-col overflow-hidden pl-60">
          {children}
        </main>
      </div>
    </UserProvider>
  );
}
