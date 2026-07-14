'use client';

import dynamic from 'next/dynamic';

// three.js (~120KB gz) é só decoração de fundo — carrega DEPOIS do conteúdo
// crítico, fora do bundle inicial e do HTML do server (ssr: false).
// Não afeta LCP: o hero é texto e renderiza antes.
export const DottedSurfaceLazy = dynamic(
  () => import('./dotted-surface').then((m) => m.DottedSurface),
  { ssr: false },
);
