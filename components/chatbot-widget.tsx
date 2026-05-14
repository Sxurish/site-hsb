'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import styles from './chatbot-widget.module.css';
import { track } from '@/lib/analytics';

const STORAGE_KEY = 'hsb_chat_v2';
const SESSION_KEY = 'hsb_chat_session_v1';

type Msg = { role: 'bot' | 'user'; text: string };
type Stored = { locale: string; msgs: Msg[] };
type Step = 'service_identified' | 'contact_data_collecting' | 'contact_data_complete';

function getOrCreateSessionId(): string {
  if (typeof window === 'undefined') return '';
  try {
    const existing = localStorage.getItem(SESSION_KEY);
    if (existing) return existing;
    const fresh = typeof crypto !== 'undefined' && 'randomUUID' in crypto
      ? crypto.randomUUID()
      : `web_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`;
    localStorage.setItem(SESSION_KEY, fresh);
    return fresh;
  } catch {
    return `web_${Date.now()}`;
  }
}

export function ChatbotWidget() {
  const t = useTranslations('Chatbot');
  const locale = useLocale();

  const QUICK_PROMPTS = [t('quick.q1'), t('quick.q2'), t('quick.q3'), t('quick.q4')];
  const INITIAL_MSGS: Msg[] = [{ role: 'bot', text: t('greeting') }];

  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [text, setText] = useState('');
  const [msgs, setMsgs] = useState<Msg[]>(INITIAL_MSGS);
  const [error, setError] = useState<string | null>(null);

  const streamRef = useRef<HTMLDivElement>(null);
  const inputRef  = useRef<HTMLTextAreaElement>(null);
  const lastUserMsg = useRef<string>('');
  const messagesSentRef = useRef<number>(0);
  const lastStepRef = useRef<Step | undefined>(undefined);
  const completedRef = useRef<boolean>(false);

  // Hidrata do sessionStorage. Se locale mudou ou nao ha conversa real, usa greeting do locale atual.
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Stored;
        if (parsed?.locale === locale && Array.isArray(parsed.msgs) && parsed.msgs.length > 1) {
          setMsgs(parsed.msgs);
          return;
        }
        if (parsed?.locale !== locale) {
          sessionStorage.removeItem(STORAGE_KEY);
        }
      }
    } catch { /* ignore */ }
    // sem conversa real → reseta para o greeting do locale atual
    setMsgs([{ role: 'bot', text: t('greeting') }]);
  }, [locale, t]);

  // Persiste mudanças (com locale)
  useEffect(() => {
    try {
      const payload: Stored = { locale, msgs };
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch { /* ignore */ }
  }, [msgs, locale]);

  // Auto-scroll
  useEffect(() => {
    if (streamRef.current) streamRef.current.scrollTop = streamRef.current.scrollHeight;
  }, [msgs, busy, open]);

  // Foco no input ao abrir + ESC fecha
  useEffect(() => {
    if (!open) return;
    const t = setTimeout(() => inputRef.current?.focus(), 80);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
        track('chatbot_closed', { messagesSent: messagesSentRef.current });
      }
    };
    window.addEventListener('keydown', onKey);
    return () => { clearTimeout(t); window.removeEventListener('keydown', onKey); };
  }, [open]);

  // Abandono: dispara antes do unload se houve interação sem completar
  useEffect(() => {
    const onUnload = () => {
      if (messagesSentRef.current > 0 && !completedRef.current) {
        track('chatbot_abandoned', {
          messagesSent: messagesSentRef.current,
          lastStep: lastStepRef.current,
        });
      }
    };
    window.addEventListener('beforeunload', onUnload);
    return () => window.removeEventListener('beforeunload', onUnload);
  }, []);

  // Calcula um delay natural baseado no tamanho da mensagem anterior
  // (simula tempo de leitura/digitação humana).
  const computeDelay = (prevLen: number) =>
    Math.min(2000, 700 + prevLen * 25);

  const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

  const send = useCallback(async (raw?: string) => {
    const q = (raw ?? text).trim();
    if (!q || busy) return;
    if (q.length > 500) {
      setError(t('tooLong'));
      return;
    }
    setError(null);
    setText('');
    // Reseta altura do textarea (auto-grow não dispara em mudança programática)
    if (inputRef.current) inputRef.current.style.height = '';
    lastUserMsg.current = q;
    messagesSentRef.current += 1;

    track('chatbot_message_sent', {
      length: q.length,
      messagesSent: messagesSentRef.current,
    });

    setMsgs((m) => [...m, { role: 'user', text: q }]);
    setBusy(true);

    try {
      const ctrl = new AbortController();
      const timeoutId = setTimeout(() => ctrl.abort(), 20000);

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: q, sessionId: getOrCreateSessionId() }),
        signal: ctrl.signal,
      });
      clearTimeout(timeoutId);

      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      const step = (data.step as Step | undefined);

      // Aceita o novo contrato (array) ou cai pro antigo (string única).
      const repliesArr: string[] = Array.isArray(data.replies) && data.replies.length
        ? data.replies.map((s: unknown) => String(s ?? '').trim()).filter(Boolean)
        : (typeof data.reply === 'string' && data.reply.trim())
          ? [data.reply.trim()]
          : [t('fallback')];

      track('chatbot_message_received', { step });

      if (step && step !== lastStepRef.current) {
        lastStepRef.current = step;
        track('chatbot_step_reached', { step });
      }

      if (step === 'contact_data_complete' && !completedRef.current) {
        completedRef.current = true;
        track('chatbot_completed', { messagesSent: messagesSentRef.current });
      }

      // Primeira bolha entra com delay curto (simula a IA "começando" a responder).
      await sleep(400);
      setMsgs((m) => [...m, { role: 'bot', text: repliesArr[0]! }]);

      // Bolhas seguintes: pausa proporcional ao tamanho da anterior + typing indicator.
      for (let i = 1; i < repliesArr.length; i++) {
        await sleep(computeDelay(repliesArr[i - 1]!.length));
        setMsgs((m) => [...m, { role: 'bot', text: repliesArr[i]! }]);
      }
    } catch {
      setMsgs((m) => [...m, { role: 'bot', text: t('errorMsg') }]);
      setError('retry');
    } finally {
      setBusy(false);
    }
  }, [text, busy, t]);

  const retry = () => { if (lastUserMsg.current) send(lastUserMsg.current); };

  const reset = () => {
    setMsgs(INITIAL_MSGS);
    messagesSentRef.current = 0;
    lastStepRef.current = undefined;
    completedRef.current = false;
    try {
      sessionStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(SESSION_KEY);
    } catch { /* ignore */ }
  };

  const handleOpen = () => {
    setOpen(true);
    track('chatbot_opened');
  };

  const handleClose = () => {
    setOpen(false);
    track('chatbot_closed', { messagesSent: messagesSentRef.current });
  };

  return (
    <>
      {!open && (
        <button
          className={styles.fab}
          onClick={handleOpen}
          aria-label={t('fabAria')}
          aria-expanded={false}
        >
          <span className={styles.pulse} aria-hidden="true" />
          {t('fabLabel')}
        </button>
      )}

      {open && (
        <div
          className={styles.chat}
          role="dialog"
          aria-label={t('dialogAria')}
          aria-modal="false"
        >
          <div className={styles.chatHd}>
            <div className={styles.who}>
              <div className={styles.avatar} aria-hidden="true">H</div>
              <div>
                <div className={styles.name}>{t('title')}</div>
                <div className={styles.status}>
                  <span className={styles.live} />
                  {t('status')}
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 6 }}>
              {msgs.length > 1 && (
                <button
                  className={styles.closeBtn}
                  onClick={reset}
                  aria-label={t('clearAria')}
                  title={t('clearTitle')}
                >
                  ↻
                </button>
              )}
              <button
                className={styles.closeBtn}
                onClick={handleClose}
                aria-label={t('closeAria')}
              >
                ✕
              </button>
            </div>
          </div>

          {/* Stream */}
          <div
            className={styles.stream}
            ref={streamRef}
            role="log"
            aria-live="polite"
            aria-atomic="false"
          >
            {msgs.map((m, i) => (
              <div key={i} className={`${styles.msg} ${m.role === 'user' ? styles.user : styles.bot}`}>
                {m.text}
              </div>
            ))}
            {busy && (
              <div
                className={`${styles.msg} ${styles.bot} ${styles.thinking}`}
                aria-label={t('typingAria')}
              >
                <i /><i /><i />
              </div>
            )}
            {error === 'retry' && !busy && (
              <button
                onClick={retry}
                style={{
                  alignSelf: 'flex-start',
                  background: 'transparent',
                  border: '1px solid var(--line-2)',
                  color: 'var(--bone-d)',
                  padding: '6px 12px',
                  borderRadius: 999,
                  fontFamily: 'var(--mono)',
                  fontSize: 11,
                  cursor: 'pointer',
                  letterSpacing: '.1em',
                  textTransform: 'uppercase',
                }}
              >
                {t('retry')}
              </button>
            )}
          </div>

          {msgs.length <= 1 && !busy && (
            <div className={styles.quick} role="group" aria-label={t('quickAria')}>
              {QUICK_PROMPTS.map((p) => (
                <button key={p} className={styles.chip} onClick={() => send(p)}>
                  {p}
                </button>
              ))}
            </div>
          )}

          <form
            className={styles.form}
            onSubmit={(e) => { e.preventDefault(); send(); }}
          >
            <textarea
              ref={inputRef}
              className={styles.input}
              placeholder={t('inputPlaceholder')}
              value={text}
              onChange={(e) => {
                setText(e.target.value);
                // Auto-grow até o max-height definido no CSS
                e.currentTarget.style.height = 'auto';
                e.currentTarget.style.height = e.currentTarget.scrollHeight + 'px';
                if (error && error !== 'retry') setError(null);
              }}
              onKeyDown={(e) => {
                // Enter envia; Shift+Enter quebra linha
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  send();
                }
              }}
              aria-label={t('inputAria')}
              disabled={busy}
              maxLength={500}
              autoComplete="off"
              rows={1}
            />
            <button
              className={styles.sendBtn}
              type="submit"
              disabled={busy || !text.trim()}
              aria-label={t('sendAria')}
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                width="16"
                height="16"
                aria-hidden="true"
              >
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </button>
          </form>
          {error && error !== 'retry' && (
            <p style={{ padding: '0 16px 10px', color: 'var(--bone-d)', fontSize: 11, fontFamily: 'var(--mono)' }}>
              {error}
            </p>
          )}
        </div>
      )}
    </>
  );
}
