'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

function UpdatePasswordForm() {
  const router = useRouter();
  const params = useSearchParams();

  const [password, setPassword]       = useState('');
  const [confirm, setConfirm]         = useState('');
  const [error, setError]             = useState<string | null>(null);
  const [loading, setLoading]         = useState(false);
  const [ready, setReady]             = useState(false);

  useEffect(() => {
    const code = params.get('code');
    if (code) {
      createClient().auth.exchangeCodeForSession(code).finally(() => setReady(true));
    } else {
      setReady(true);
    }
  }, [params]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password.length < 12) {
      setError('A senha deve ter pelo menos 12 caracteres.');
      return;
    }
    if (password !== confirm) {
      setError('As senhas não coincidem.');
      return;
    }

    setLoading(true);
    const { error: err } = await createClient().auth.updateUser({ password });
    if (err) {
      setError(err.message);
      setLoading(false);
      return;
    }
    router.replace('/overview');
    router.refresh();
  };

  const fieldClass =
    'w-full rounded-xl border border-border bg-surface-2 px-4 py-3 text-sm text-ink placeholder:text-muted/50 outline-none transition focus:border-gold/40 focus:ring-2 focus:ring-gold/10 disabled:opacity-50';

  return (
    <div className="flex min-h-screen items-center justify-center bg-bg">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_at_top,rgba(212,165,102,0.06)_0%,transparent_60%)]" />

      <div className="relative w-full max-w-sm px-4">
        <div className="mb-8 flex flex-col items-center gap-3">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gold-dim ring-1 ring-gold/25">
            <span className="text-2xl font-black tracking-tighter text-gold">H</span>
          </div>
          <p className="text-xs font-medium uppercase tracking-[0.25em] text-muted">Definir nova senha</p>
        </div>

        <div className="rounded-2xl border border-border bg-surface p-6 shadow-card">
          <h1 className="mb-1 text-xl font-bold text-ink">Nova senha</h1>
          <p className="mb-6 text-sm text-muted">Mínimo 12 caracteres.</p>

          {!ready ? (
            <div className="flex justify-center py-6">
              <Loader2 className="h-5 w-5 animate-spin text-muted" />
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mb-1.5 block text-xs font-medium uppercase tracking-[0.15em] text-muted">Nova senha</label>
                <input
                  type="password"
                  required
                  autoComplete="new-password"
                  placeholder="••••••••••••"
                  disabled={loading}
                  className={fieldClass}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium uppercase tracking-[0.15em] text-muted">Confirme</label>
                <input
                  type="password"
                  required
                  autoComplete="new-password"
                  placeholder="••••••••••••"
                  disabled={loading}
                  className={fieldClass}
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                />
              </div>

              {error && (
                <p className="rounded-xl border border-danger/20 bg-danger/5 px-4 py-2.5 text-sm text-danger">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gold px-6 py-3 text-sm font-bold text-bg transition hover:opacity-90 active:scale-[0.99] disabled:opacity-60"
              >
                {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                {loading ? 'Salvando...' : 'Atualizar senha'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default function UpdatePasswordPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center bg-bg"><Loader2 className="h-5 w-5 animate-spin text-muted" /></div>}>
      <UpdatePasswordForm />
    </Suspense>
  );
}
