'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Loader2, ArrowLeft, MailCheck } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export default function ResetPasswordPage() {
  const [email, setEmail]     = useState('');
  const [error, setError]     = useState<string | null>(null);
  const [sent, setSent]       = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const supabase = createClient();
    const redirectTo = `${window.location.origin}/auth/update-password`;
    const { error: err } = await supabase.auth.resetPasswordForEmail(email.trim(), { redirectTo });

    if (err) {
      setError(err.message);
      setLoading(false);
      return;
    }

    setSent(true);
    setLoading(false);
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
          <p className="text-xs font-medium uppercase tracking-[0.25em] text-muted">Recuperar acesso</p>
        </div>

        <div className="rounded-2xl border border-border bg-surface p-6 shadow-card">
          {sent ? (
            <div className="space-y-3 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-success/10">
                <MailCheck className="h-6 w-6 text-success" />
              </div>
              <h1 className="text-lg font-bold text-ink">Verifique seu e-mail</h1>
              <p className="text-sm text-muted">
                Se houver uma conta com <span className="text-ink">{email}</span>, enviamos um link
                para redefinir a senha. O link expira em 1 hora.
              </p>
              <Link href="/login" className="inline-flex items-center gap-1.5 text-xs text-muted hover:text-ink">
                <ArrowLeft className="h-3 w-3" /> Voltar pro login
              </Link>
            </div>
          ) : (
            <>
              <h1 className="mb-1 text-xl font-bold text-ink">Recuperar senha</h1>
              <p className="mb-6 text-sm text-muted">Enviaremos um link pro seu e-mail.</p>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="mb-1.5 block text-xs font-medium uppercase tracking-[0.15em] text-muted">E-mail</label>
                  <input
                    type="email"
                    required
                    autoComplete="email"
                    placeholder="voce@hsbcompany.com.br"
                    disabled={loading}
                    className={fieldClass}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
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
                  {loading ? 'Enviando...' : 'Enviar link'}
                </button>

                <p className="pt-1 text-center text-xs">
                  <Link href="/login" className="inline-flex items-center gap-1.5 text-muted transition hover:text-ink">
                    <ArrowLeft className="h-3 w-3" /> Voltar pro login
                  </Link>
                </p>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
