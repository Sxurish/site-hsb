import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Login' };

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-bg">
      {/* Fundo sutil */}
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_at_top,rgba(212,165,102,0.06)_0%,transparent_60%)]" />

      <div className="relative w-full max-w-sm px-4">
        {/* Logo */}
        <div className="mb-8 flex flex-col items-center gap-3">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gold-dim ring-1 ring-gold/25">
            <span className="text-2xl font-black tracking-tighter text-gold">H</span>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold text-ink">HSB Company</p>
            <p className="text-xs font-medium uppercase tracking-[0.25em] text-muted">Área Interna</p>
          </div>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-border bg-surface p-6 shadow-card">
          <h1 className="mb-1 text-xl font-bold text-ink">Entrar</h1>
          <p className="mb-6 text-sm text-muted">Acesso restrito a colaboradores HSB.</p>

          {/* TODO: conectar com NextAuth ou Supabase Auth */}
          <form className="space-y-4" action="/overview">
            <div>
              <label className="mb-1.5 block text-xs font-medium uppercase tracking-[0.15em] text-muted">
                E-mail
              </label>
              <input
                type="email"
                name="email"
                required
                placeholder="seu@hsbcompany.com.br"
                className="w-full rounded-xl border border-border bg-surface-2 px-4 py-3 text-sm text-ink placeholder:text-muted/50 outline-none transition focus:border-gold/40 focus:ring-2 focus:ring-gold/10"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium uppercase tracking-[0.15em] text-muted">
                Senha
              </label>
              <input
                type="password"
                name="password"
                required
                placeholder="••••••••"
                className="w-full rounded-xl border border-border bg-surface-2 px-4 py-3 text-sm text-ink placeholder:text-muted/50 outline-none transition focus:border-gold/40 focus:ring-2 focus:ring-gold/10"
              />
            </div>
            <button
              type="submit"
              className="mt-2 w-full rounded-xl bg-gold px-6 py-3 text-sm font-bold text-bg transition hover:opacity-90 active:scale-[0.99]"
            >
              Acessar Dashboard
            </button>
          </form>

          <p className="mt-4 text-center text-xs text-muted">
            Problemas de acesso? Fale com o admin.
          </p>
        </div>

        <p className="mt-6 text-center text-xs text-muted/40">
          © {new Date().getFullYear()} HSB Company · Uso interno
        </p>
      </div>
    </div>
  );
}
