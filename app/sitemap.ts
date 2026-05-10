import type { MetadataRoute } from 'next';
import { routing } from '@/i18n/routing';

const SITE = 'https://hsb.company';

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  const sections = ['', '#sobre', '#servicos', '#portfolio', '#processo', '#clientes', '#contato'];

  const entries: MetadataRoute.Sitemap = [];

  for (const locale of routing.locales) {
    const prefix = locale === routing.defaultLocale ? '' : `/${locale}`;
    sections.forEach((s, i) => {
      entries.push({
        url: `${SITE}${prefix}/${s}`,
        lastModified,
        changeFrequency: 'monthly' as const,
        priority: i === 0 ? 1 : 0.7,
        alternates: {
          languages: Object.fromEntries(
            routing.locales.map((l) => {
              const p = l === routing.defaultLocale ? '' : `/${l}`;
              return [l, `${SITE}${p}/${s}`];
            }),
          ),
        },
      });
    });
  }

  return entries;
}
