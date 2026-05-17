import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

// `requestHeaders` é opcional pra retrocompat — quando o middleware passa
// headers com `x-nonce`/CSP, propagamos pra que server components leiam via
// `headers()` e Next aplique a CSP nos scripts streaming.
export async function updateSession(request: NextRequest, requestHeaders?: Headers) {
  const nextInit = requestHeaders
    ? { request: { headers: requestHeaders } }
    : { request };
  let supabaseResponse = NextResponse.next(nextInit);

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next(nextInit);
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  // Refresh do token + retorna user (não usar getSession aqui — Supabase recomenda getUser).
  const { data: { user } } = await supabase.auth.getUser();

  return { supabaseResponse, user };
}
