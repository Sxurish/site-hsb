'use client';

import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';

interface TeamMember {
  id: string;
  email: string;
  role: 'admin' | 'viewer';
  full_name: string | null;
  created_at: string;
}

function initials(name: string | null, email: string) {
  if (name) {
    const parts = name.trim().split(/\s+/);
    return ((parts[0]?.[0] ?? '') + (parts[parts.length - 1]?.[0] ?? '')).toUpperCase() || '?';
  }
  return (email[0] ?? '?').toUpperCase();
}

function RoleBadge({ role }: { role: 'admin' | 'viewer' }) {
  return (
    <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
      role === 'admin' ? 'bg-gold-dim text-gold' : 'bg-surface-2 text-muted'
    }`}>
      {role}
    </span>
  );
}

export function TeamSection({ currentUserId }: { currentUserId: string }) {
  const [members, setMembers]         = useState<TeamMember[]>([]);
  const [loading, setLoading]         = useState(true);
  const [updating, setUpdating]       = useState<string | null>(null);
  const [error, setError]             = useState('');

  useEffect(() => {
    fetch('/api/team')
      .then((r) => r.json())
      .then((d) => { setMembers(d.users ?? []); setLoading(false); })
      .catch(() => { setError('Erro ao carregar equipe.'); setLoading(false); });
  }, []);

  const toggleRole = async (member: TeamMember) => {
    const newRole = member.role === 'admin' ? 'viewer' : 'admin';
    setUpdating(member.id);

    const res = await fetch(`/api/team/${member.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role: newRole }),
    });

    if (res.ok) {
      setMembers((prev) =>
        prev.map((m) => (m.id === member.id ? { ...m, role: newRole } : m))
      );
    } else {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? 'Erro ao atualizar role.');
    }
    setUpdating(null);
  };

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted py-2">
        <Loader2 className="h-4 w-4 animate-spin" />
        Carregando equipe...
      </div>
    );
  }

  if (error) {
    return (
      <p className="rounded-xl border border-danger/20 bg-danger/5 px-4 py-2.5 text-sm text-danger">
        {error}
      </p>
    );
  }

  return (
    <div className="space-y-2">
      <p className="mb-4 text-xs text-muted">
        {members.length} {members.length === 1 ? 'colaborador' : 'colaboradores'} com acesso ao dashboard.
        Clique no badge para alterar o role (exceto o seu próprio).
      </p>
      {members.map((m) => (
        <div
          key={m.id}
          className="flex items-center gap-3 rounded-xl border border-border bg-surface-2/50 px-4 py-3"
        >
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gold-dim ring-1 ring-gold/20">
            <span className="text-xs font-bold text-gold">{initials(m.full_name, m.email)}</span>
          </div>

          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-ink">
              {m.full_name ?? m.email}
            </p>
            {m.full_name && (
              <p className="truncate text-xs text-muted">{m.email}</p>
            )}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {updating === m.id ? (
              <Loader2 className="h-4 w-4 animate-spin text-muted" />
            ) : m.id === currentUserId ? (
              <RoleBadge role={m.role} />
            ) : (
              <button
                onClick={() => toggleRole(m)}
                title={`Alterar para ${m.role === 'admin' ? 'viewer' : 'admin'}`}
                className="rounded-full transition hover:ring-2 hover:ring-gold/30"
              >
                <RoleBadge role={m.role} />
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
