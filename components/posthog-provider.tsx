'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import posthog from 'posthog-js';
import { readConsent } from '@/lib/analytics';

let initialized = false;

function bootIfAllowed() {
  if (initialized) return;
  if (typeof window === 'undefined') return;

  const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
  // O front sempre fala com /ingest (proxy reverso no next.config.mjs)
  // pra burlar adblockers que bloqueiam *.posthog.com (ERR_BLOCKED_BY_CLIENT).
  // O ui_host aponta pro domínio real só pra os links "Open in PostHog" funcionarem.
  if (!key) return;

  const consent = readConsent();
  if (!consent?.analytics) return;

  posthog.init(key, {
    api_host: '/ingest',
    ui_host: 'https://eu.posthog.com',
    person_profiles: 'identified_only',
    capture_pageview: false,
    capture_pageleave: true,
    autocapture: true,
    disable_session_recording: true,
    respect_dnt: true,
    persistence: 'localStorage+cookie',
    ip: false,
    loaded: (ph) => {
      if (process.env.NODE_ENV === 'development') ph.debug(false);
    },
  });

  initialized = true;
}

export function PostHogPageview() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    bootIfAllowed();
    if (!initialized) return;

    const url = window.origin + pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : '');
    posthog.capture('$pageview', { $current_url: url });
  }, [pathname, searchParams]);

  useEffect(() => {
    const onConsentChange = () => bootIfAllowed();
    window.addEventListener('hsb:consent-changed', onConsentChange);
    return () => window.removeEventListener('hsb:consent-changed', onConsentChange);
  }, []);

  return null;
}

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
