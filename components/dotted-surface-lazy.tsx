'use client';

import dynamic from 'next/dynamic';

// Carrega o Three.js (~150KB gzip) só no client, fora do bundle inicial.
// O canvas é puramente decorativo (aria-hidden), então não precisa de SSR.
export const DottedSurface = dynamic(
  () => import('./dotted-surface').then((m) => m.DottedSurface),
  { ssr: false },
);
