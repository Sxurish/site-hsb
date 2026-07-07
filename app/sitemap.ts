import type { MetadataRoute } from 'next';
import { routing } from '@/i18n/routing';

const SITE = 'https://hsb.company';

// Sitemaps não aceitam fragmentos (#secao) — buscadores ignoram a parte após
// o #, então só entram páginas canônicas: a home em cada idioma.
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  const languages = Object.fromEntries(
    routing.locales.map((l) => {
      const p = l === routing.defaultLocale ? '' : `/${l}`;
      return [l, `${SITE}${p}/`];
    }),
  );

  return routing.locales.map((locale) => {
    const prefix = locale === routing.defaultLocale ? '' : `/${locale}`;
    return {
      url: `${SITE}${prefix}/`,
      lastModified,
      changeFrequency: 'monthly' as const,
      priority: locale === routing.defaultLocale ? 1 : 0.8,
      alternates: { languages },
    };
  });
}
