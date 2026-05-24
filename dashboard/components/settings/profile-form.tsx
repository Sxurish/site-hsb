'use client';

import { useState } from 'react';
import { Loader2, Check } from 'lucide-react';
import type { DashboardUser } from '@/lib/auth';

const inputClass =
  'w-full rounded-xl border border-border bg-surface-2 px-4 py-3 text-sm text-ink placeholder:text-muted/50 outline-none transition focus:border-gold/40 focus:ring-2 focus:ring-gold/10 disabled:opacity-50';

export function ProfileForm({ user }: { user: DashboardUser }) {
  const [name, setName] = useState(user.full_name ?? '');
  const [status, setStatus] = useState<'idle' | 'loading' | 'ok' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const dirty = name.trim() !== (user.full_name ?? '');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMsg('');

    const res = await fetch('/api/me', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ full_name: name }),
    });

    if (res.ok) {
      setStatus('ok');
      setTimeout(() => setStatus('idle'), 2500);
    } else {
      const data = await res.json().catch(() => ({}));
      setErrorMsg(data.error ?? 'Erro ao salvar. Tente novamente.');
      setStatus('error');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 border-t border-border pt-4">
      <div>
        <label className="mb-1.5 block text-xs font-medium uppercase tracking-[0.15em] text-muted">
          Nome completo
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => { setName(e.target.value); setStatus('idle'); }}
          placeholder="Seu nome"
          maxLength={80}
          disabled={status === 'loading'}
          className={inputClass}
        />
      </div>

      <div>
        <label className="mb-1.5 block text-xs font-medium uppercase tracking-[0.15em] text-muted">
          E-mail
        </label>
        <input
          type="email"
          value={user.email}
          disabled
          className={inputClass}
        />
        <p className="mt-1 text-[11px] text-muted">
          O e-mail é gerenciado pelo Supabase Auth e não pode ser alterado aqui.
        </p>
      </div>

      {status === 'error' && (
        <p className="rounded-xl border border-danger/20 bg-danger/5 px-4 py-2.5 text-sm text-danger">
          {errorMsg}
        </p>
      )}

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={!dirty || status === 'loading'}
          className="inline-flex items-center gap-2 rounded-xl bg-gold px-5 py-2.5 text-sm font-bold text-bg transition hover:opacity-90 active:scale-[0.99] disabled:opacity-40"
        >
          {status === 'loading' && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
          {status === 'ok' ? 'Salvo!' : 'Salvar nome'}
        </button>
        {status === 'ok' && <Check className="h-4 w-4 text-green-400" />}
      </div>
    </form>
  );
}
