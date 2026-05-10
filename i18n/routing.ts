import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  // Fase 2: 6 idiomas ativos. Fallback automatico para outros idiomas
  // sera adicionado na Fase 3 via DeepL API.
  locales: ['pt-BR', 'en', 'es', 'fr', 'de', 'zh-CN'],
  defaultLocale: 'pt-BR',
  localePrefix: 'as-needed',
  localeDetection: true,
});

export type Locale = (typeof routing.locales)[number];
