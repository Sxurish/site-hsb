import type { MetadataRoute } from 'next';
import { routing } from '@/i18n/routing';

const SITE = 'https://hsb.company';

// Sitemaps não aceitam fragmentos (#secao) — buscadores ignoram a parte após
// o #, então só entram páginas canônicas: home e privacidade em cada idioma.
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  const urlFor = (locale: string, path: string) => {
    const prefix = locale === routing.defaultLocale ? '' : `/${locale}`;
    return `${SITE}${prefix}${path}`;
  };

  const pages: { path: string; changeFrequency: 'monthly' | 'yearly'; priority: (l: string) => number }[] = [
    { path: '/', changeFrequency: 'monthly', priority: (l) => (l === routing.defaultLocale ? 1 : 0.8) },
    { path: '/privacidade', changeFrequency: 'yearly', priority: () => 0.3 },
  ];

  return pages.flatMap(({ path, changeFrequency, priority }) => {
    const languages = Object.fromEntries(routing.locales.map((l) => [l, urlFor(l, path)]));
    return routing.locales.map((locale) => ({
      url: urlFor(locale, path),
      lastModified,
      changeFrequency,
      priority: priority(locale),
      alternates: { languages },
    }));
  });
}
