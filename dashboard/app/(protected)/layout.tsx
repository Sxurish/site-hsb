import { Sidebar } from '@/components/layout/sidebar';

// TODO: adicionar guard de autenticação aqui quando NextAuth/Supabase Auth estiver configurado
// import { getServerSession } from 'next-auth';
// import { redirect } from 'next/navigation';
// const session = await getServerSession();
// if (!session) redirect('/login');

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden bg-bg">
      <Sidebar />
      {/* Conteúdo principal com offset da sidebar */}
      <main className="flex flex-1 flex-col overflow-hidden pl-60">
        {children}
      </main>
    </div>
  );
}
