import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  // Fase 1: apenas pt-BR ativo. Fase 2 adiciona en/es/fr/de/zh.
  locales: ['pt-BR'],
  defaultLocale: 'pt-BR',
  localePrefix: 'as-needed',
  localeDetection: true,
});

export type Locale = (typeof routing.locales)[number];
