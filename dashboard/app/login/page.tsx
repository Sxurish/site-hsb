'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Loader2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

// Bloqueia open redirect via `?from=//evil.com` no router.replace.
function safeFrom(raw: string | null): string {
  if (!raw) return '/overview';
  if (!raw.startsWith('/') || raw.startsWith('//') || raw.startsWith('/\\')) return '/overview';
  return raw;
}

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const from = safeFrom(params.get('from'));

  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState<string | null>(null);
  const [loading, setLoading]   = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { error: authError } = await createClient().auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (authError) {
      setError(
        authError.message === 'Invalid login credentials'
          ? 'E-mail ou senha incorretos.'
          : authError.message,
      );
      setPassword('');
      setLoading(false);
      return;
    }

    router.replace(from);
    router.refresh();
  };

  const fieldClass =
    'w-full rounded-xl border border-border bg-surface-2 px-4 py-3 text-sm text-ink placeholder:text-muted/50 outline-none transition focus:border-gold/40 focus:ring-2 focus:ring-gold/10 disabled:opacity-50';

  return (
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
      <div>
        <label className="mb-1.5 block text-xs font-medium uppercase tracking-[0.15em] text-muted">Senha</label>
        <input
          type="password"
          required
          autoComplete="current-password"
          placeholder="••••••••"
          disabled={loading}
          className={fieldClass}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
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
        {loading ? 'Entrando...' : 'Acessar Dashboard'}
      </button>

      <p className="pt-1 text-center text-xs">
        <Link href="/reset-password" className="text-muted transition hover:text-ink">
          Esqueci minha senha
        </Link>
      </p>
    </form>
  );
}

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-bg">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_at_top,rgba(212,165,102,0.06)_0%,transparent_60%)]" />

      <div className="relative w-full max-w-sm px-4">
        <div className="mb-8 flex flex-col items-center gap-3">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gold-dim ring-1 ring-gold/25">
            <span className="text-2xl font-black tracking-tighter text-gold">H</span>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold text-ink">HSB Company</p>
            <p className="text-xs font-medium uppercase tracking-[0.25em] text-muted">Área Interna</p>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-surface p-6 shadow-card">
          <h1 className="mb-1 text-xl font-bold text-ink">Entrar</h1>
          <p className="mb-6 text-sm text-muted">Acesso restrito a colaboradores HSB.</p>
          <Suspense>
            <LoginForm />
          </Suspense>
        </div>

        <p className="mt-6 text-center text-xs text-muted/40">
          © {new Date().getFullYear()} HSB Company · Uso interno
        </p>
      </div>
    </div>
  );
}
