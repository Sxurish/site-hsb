import type { MetadataRoute } from 'next';

const SITE = 'https://hsb.company';

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  const sections = ['', '#sobre', '#servicos', '#portfolio', '#processo', '#clientes', '#contato'];

  return sections.map((s, i) => ({
    url: `${SITE}/${s}`,
    lastModified,
    changeFrequency: 'monthly' as const,
    priority: i === 0 ? 1 : 0.7,
  }));
}
