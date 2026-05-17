import { NextResponse, type NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// Restringe a paths internos pra evitar open redirect via `?next=//evil.com`.
function safeNext(raw: string | null): string {
  if (!raw) return '/overview';
  // Tem que começar com `/` simples (não `//` que vira host externo no new URL).
  if (!raw.startsWith('/') || raw.startsWith('//') || raw.startsWith('/\\')) return '/overview';
  return raw;
}

// Endpoint que Supabase chama via link no email (reset/invite/magic link).
// Troca o `code` por uma sessão e redireciona o usuário.
export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const code = url.searchParams.get('code');
  const next = safeNext(url.searchParams.get('next'));

  if (!code) {
    return NextResponse.redirect(new URL('/login?error=missing_code', req.url));
  }

  const supabase = createClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    return NextResponse.redirect(new URL(`/login?error=${encodeURIComponent(error.message)}`, req.url));
  }

  return NextResponse.redirect(new URL(next, req.url));
}
