import { Header } from '@/components/layout/header';
import { requireUser } from '@/lib/auth';
import { ProfileForm } from '@/components/settings/profile-form';
import { PasswordForm } from '@/components/settings/password-form';
import { TeamSection } from '@/components/settings/team-section';

function initials(name: string | null, email: string) {
  if (name) {
    const parts = name.trim().split(/\s+/);
    return ((parts[0]?.[0] ?? '') + (parts[parts.length - 1]?.[0] ?? '')).toUpperCase() || '?';
  }
  return (email[0] ?? '?').toUpperCase();
}

export default async function SettingsPage() {
  const user = await requireUser();

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <Header title="Configurações" subtitle="Perfil, segurança e equipe" />

      <div className="flex-1 overflow-y-auto px-4 py-4 sm:px-6 sm:py-6">
        <div className="mx-auto max-w-2xl space-y-6">

          {/* Perfil */}
          <section>
            <h2 className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-muted">Meu perfil</h2>
            <div className="rounded-2xl border border-border bg-surface p-6 space-y-4">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-gold-dim ring-2 ring-gold/20">
                  <span className="text-xl font-black text-gold">
                    {initials(user.full_name, user.email)}
                  </span>
                </div>
                <div className="min-w-0">
                  <p className="truncate text-base font-bold text-ink">{user.full_name ?? '—'}</p>
                  <p className="truncate text-sm text-muted">{user.email}</p>
                  <span className={`mt-1.5 inline-block rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                    user.role === 'admin' ? 'bg-gold-dim text-gold' : 'bg-surface-2 text-muted'
                  }`}>
                    {user.role}
                  </span>
                </div>
              </div>
              <ProfileForm user={user} />
            </div>
          </section>

          {/* Segurança */}
          <section>
            <h2 className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-muted">Segurança</h2>
            <div className="rounded-2xl border border-border bg-surface p-6">
              <p className="mb-4 text-sm text-muted">
                Defina uma nova senha para sua conta. Use no mínimo 8 caracteres.
              </p>
              <PasswordForm />
            </div>
          </section>

          {/* Equipe — admin only */}
          {user.role === 'admin' && (
            <section>
              <h2 className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-muted">Equipe</h2>
              <div className="rounded-2xl border border-border bg-surface p-6">
                <TeamSection currentUserId={user.id} />
              </div>
            </section>
          )}

        </div>
      </div>
    </div>
  );
}
