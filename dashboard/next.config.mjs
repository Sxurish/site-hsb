// Permissions-Policy fechado pra tudo que um dashboard interno não precisa.
// `interest-cohort=()` neutraliza FLoC; clipboard/usb/serial/etc. bloqueiam APIs sensíveis.
const PERMISSIONS_POLICY = [
  'accelerometer=()', 'autoplay=()', 'bluetooth=()', 'camera=()',
  'clipboard-read=()', 'clipboard-write=()', 'display-capture=()',
  'encrypted-media=()', 'fullscreen=(self)', 'geolocation=()',
  'gyroscope=()', 'hid=()', 'interest-cohort=()', 'magnetometer=()',
  'microphone=()', 'midi=()', 'payment=()', 'picture-in-picture=()',
  'screen-wake-lock=()', 'serial=()', 'sync-xhr=()', 'usb=()',
  'web-share=()', 'xr-spatial-tracking=()',
].join(', ');

/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  reactStrictMode: true,
  eslint: { ignoreDuringBuilds: true },

  // Tree-shake barril de ícones/recharts pra cortar 30-80KB do bundle inicial.
  experimental: {
    optimizePackageImports: ['lucide-react', 'recharts'],
  },

  // CSP é setado no middleware (precisa de nonce dinâmico por request).
  // Os demais headers ficam estáticos aqui.
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options',       value: 'nosniff' },
          { key: 'X-Frame-Options',              value: 'DENY' },
          { key: 'Referrer-Policy',              value: 'strict-origin-when-cross-origin' },
          { key: 'Strict-Transport-Security',    value: 'max-age=63072000; includeSubDomains; preload' },
          { key: 'Permissions-Policy',           value: PERMISSIONS_POLICY },
          { key: 'Cross-Origin-Opener-Policy',   value: 'same-origin' },
          { key: 'Cross-Origin-Resource-Policy', value: 'same-origin' },
          // Instrui bots a não indexar — reforça o robots.ts
          { key: 'X-Robots-Tag',                value: 'noindex, nofollow, noarchive' },
        ],
      },
      {
        source: '/_next/static/:path*',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
      },
    ];
  },
};

export default nextConfig;
