import { requireAdmin } from '@/lib/auth';

// Lista de leads contém PII — só admin. Viewer é redirecionado pra /overview.
export default async function LeadsLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin();
  return <>{children}</>;
}
