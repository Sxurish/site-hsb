// Utilitários de sessão usando Web Crypto API (Edge + Node.js compatível).
// Token formato: base64url(userId).expUnix.base64url(HMAC-SHA256)

export const COOKIE_NAME = 'hsb_dash_session';
export const MAX_AGE_SEC = 60 * 60 * 8; // 8 horas

async function importKey(secret: string): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify'],
  );
}

function b64uEncode(buf: ArrayBuffer): string {
  return btoa(String.fromCharCode(...new Uint8Array(buf)))
    .replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}

function b64uDecode(s: string): Uint8Array {
  const padded = s.replace(/-/g, '+').replace(/_/g, '/')
    .padEnd(s.length + (4 - (s.length % 4)) % 4, '=');
  return Uint8Array.from(atob(padded), (c) => c.charCodeAt(0));
}

export async function createSessionToken(userId: string): Promise<string> {
  const secret = process.env.DASHBOARD_SESSION_SECRET;
  if (!secret) throw new Error('DASHBOARD_SESSION_SECRET não configurado.');
  const exp = Math.floor(Date.now() / 1000) + MAX_AGE_SEC;
  const payload = `${encodeURIComponent(userId)}.${exp}`;
  const key = await importKey(secret);
  const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(payload));
  return `${payload}.${b64uEncode(sig)}`;
}

export async function verifySessionToken(token: string): Promise<string | null> {
  const secret = process.env.DASHBOARD_SESSION_SECRET;
  if (!secret) return null;
  try {
    const lastDot = token.lastIndexOf('.');
    if (lastDot === -1) return null;
    const payload = token.slice(0, lastDot);
    const sig = token.slice(lastDot + 1);

    const key = await importKey(secret);
    const valid = await crypto.subtle.verify(
      'HMAC', key, b64uDecode(sig), new TextEncoder().encode(payload),
    );
    if (!valid) return null;

    // Verifica expiração
    const expStr = payload.split('.').at(-1);
    if (!expStr || Number(expStr) < Math.floor(Date.now() / 1000)) return null;

    // Retorna userId (tudo antes do .exp)
    const expIdx = payload.lastIndexOf('.');
    return decodeURIComponent(payload.slice(0, expIdx));
  } catch {
    return null;
  }
}
