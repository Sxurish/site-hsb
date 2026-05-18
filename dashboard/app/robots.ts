import type { MetadataRoute } from 'next';

// Área interna — nunca deve ser indexada por crawlers
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', disallow: '/' },
    host: 'https://dashboard.hsbcompany.com.br',
  };
}
