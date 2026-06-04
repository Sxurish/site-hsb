import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./i18n/request.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  // Necessario pro proxy reverso do PostHog (/ingest) funcionar com paths sem trailing slash
  skipTrailingSlashRedirect: true,
  images: {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 dias
  },
  experimental: {
    optimizePackageImports: ['lucide-react', 'framer-motion'],
  },
  // Reverse proxy pra PostHog — burla adblockers (ERR_BLOCKED_BY_CLIENT)
  async rewrites() {
    return [
      {
        source: '/ingest/static/:path*',
        destination: 'https://eu-assets.i.posthog.com/static/:path*',
      },
      {
        source: '/ingest/:path*',
        destination: 'https://eu.i.posthog.com/:path*',
      },
    ];
  },
  async headers() {
    // CSP é definida por request no middleware.ts (nonce + 'strict-dynamic'),
    // pois precisa de um nonce único por resposta. Os demais headers são
    // estáticos e ficam aqui, aplicados a todas as rotas (inclusive assets/API).
    const securityHeaders = [
      { key: 'X-DNS-Prefetch-Control',          value: 'on' },
      { key: 'X-Content-Type-Options',           value: 'nosniff' },
      { key: 'X-Frame-Options',                  value: 'SAMEORIGIN' },
      { key: 'Referrer-Policy',                  value: 'strict-origin-when-cross-origin' },
      { key: 'Permissions-Policy',               value: 'camera=(), microphone=(), geolocation=(), payment=()' },
      { key: 'Strict-Transport-Security',        value: 'max-age=63072000; includeSubDomains; preload' },
      { key: 'Cross-Origin-Opener-Policy',       value: 'same-origin' },
      { key: 'Cross-Origin-Embedder-Policy',     value: 'require-corp' },
      { key: 'Cross-Origin-Resource-Policy',     value: 'same-origin' },
    ];

    return [
      { source: '/:path*', headers: securityHeaders },
      {
        source: '/logo.png',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
      },
      {
        source: '/_next/static/:path*',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
      },
    ];
  },
};

export default withNextIntl(nextConfig);
