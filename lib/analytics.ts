'use client';

import posthog from 'posthog-js';

export type AnalyticsEvent =
  | { name: 'cta_clicked'; props: { location: 'hero' | 'mid' | 'footer' | 'header' | 'whatsapp' | 'contact'; label?: string } }
  | { name: 'section_viewed'; props: { section: string } }
  | { name: 'lead_form_started'; props?: Record<string, never> }
  | { name: 'lead_form_submitted'; props: { hasPhone: boolean; hasEmail: boolean } }
  | { name: 'chatbot_opened'; props?: Record<string, never> }
  | { name: 'chatbot_closed'; props: { messagesSent: number } }
  | { name: 'chatbot_message_sent'; props: { length: number; messagesSent: number } }
  | { name: 'chatbot_message_received'; props: { step?: string } }
  | { name: 'chatbot_step_reached'; props: { step: 'service_identified' | 'contact_data_collecting' | 'contact_data_complete' } }
  | { name: 'chatbot_completed'; props: { messagesSent: number } }
  | { name: 'chatbot_abandoned'; props: { messagesSent: number; lastStep?: string } };

const CONSENT_KEY = 'hsb_consent_v1';

export type ConsentState = {
  analytics: boolean;
  decidedAt: number;
};

export function readConsent(): ConsentState | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(CONSENT_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as ConsentState;
  } catch {
    return null;
  }
}

export function writeConsent(analytics: boolean): ConsentState {
  const state: ConsentState = { analytics, decidedAt: Date.now() };
  try {
    localStorage.setItem(CONSENT_KEY, JSON.stringify(state));
  } catch { /* ignore */ }
  return state;
}

export function track<E extends AnalyticsEvent>(event: E['name'], props?: E extends { props: infer P } ? P : never) {
  if (typeof window === 'undefined') return;
  const consent = readConsent();
  if (!consent?.analytics) return;
  try {
    posthog.capture(event, props ?? {});
  } catch { /* ignore */ }
}

export function identifyAnonymous() {
  if (typeof window === 'undefined') return;
  const consent = readConsent();
  if (!consent?.analytics) return;
  try {
    if (!posthog.get_distinct_id?.()) return;
  } catch { /* ignore */ }
}
