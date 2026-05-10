'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import styles from './chatbot-widget.module.css';

const QUICK_PROMPTS = [
  'Quero escalar com IA',
  'Preciso de uma landing page',
  'Tráfego pago',
  'Falar com um humano',
];

const STORAGE_KEY = 'hsb_chat_v1';

type Msg = { role: 'bot' | 'user'; text: string };

const INITIAL_MSGS: Msg[] = [
  { role: 'bot', text: 'Oi 👋 Aqui é o concierge da HSB. Conta um pouco do que você quer construir — tráfego, IA, marca, funil — e eu te direciono pra solução certa.' },
];

export function ChatbotWidget() {
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [text, setText] = useState('');
  const [msgs, setMsgs] = useState<Msg[]>(INITIAL_MSGS);
  const [error, setError] = useState<string | null>(null);

  const streamRef = useRef<HTMLDivElement>(null);
  const inputRef  = useRef<HTMLInputElement>(null);
  const lastUserMsg = useRef<string>('');

  // Hidrata do sessionStorage
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Msg[];
        if (Array.isArray(parsed) && parsed.length) setMsgs(parsed);
      }
    } catch { /* ignore */ }
  }, []);

  // Persiste mudanças
  useEffect(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(msgs));
    } catch { /* ignore */ }
  }, [msgs]);

  // Auto-scroll
  useEffect(() => {
    if (streamRef.current) streamRef.current.scrollTop = streamRef.current.scrollHeight;
  }, [msgs, busy, open]);

  // Foco no input ao abrir + ESC fecha
  useEffect(() => {
    if (!open) return;
    const t = setTimeout(() => inputRef.current?.focus(), 80);
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    window.addEventListener('keydown', onKey);
    return () => { clearTimeout(t); window.removeEventListener('keydown', onKey); };
  }, [open]);

  const send = useCallback(async (raw?: string) => {
    const q = (raw ?? text).trim();
    if (!q || busy) return;
    if (q.length > 500) {
      setError('Mensagem muito longa (máx. 500 caracteres).');
      return;
    }
    setError(null);
    setText('');
    lastUserMsg.current = q;

    setMsgs((m) => [...m, { role: 'user', text: q }]);
    setBusy(true);

    try {
      const ctrl = new AbortController();
      const timeoutId = setTimeout(() => ctrl.abort(), 20000);

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: q }),
        signal: ctrl.signal,
      });
      clearTimeout(timeoutId);

      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      const reply = data.reply || 'Recebemos sua mensagem. Um especialista entrará em contato em breve!';
      setMsgs((m) => [...m, { role: 'bot', text: reply }]);
    } catch {
      setMsgs((m) => [...m, {
        role: 'bot',
        text: 'Tive um problema aqui. Você pode tentar novamente ou nos chamar pelo botão "Solicitar Orçamento".',
      }]);
      setError('retry');
    } finally {
      setBusy(false);
    }
  }, [text, busy]);

  const retry = () => { if (lastUserMsg.current) send(lastUserMsg.current); };

  const reset = () => {
    setMsgs(INITIAL_MSGS);
    try { sessionStorage.removeItem(STORAGE_KEY); } catch { /* ignore */ }
  };

  return (
    <>
      {!open && (
        <button
          className={styles.fab}
          onClick={() => setOpen(true)}
          aria-label="Abrir chat com a HSB"
          aria-expanded={false}
        >
          <span className={styles.pulse} aria-hidden="true" />
          Vamos conversar
        </button>
      )}

      {open && (
        <div
          className={styles.chat}
          role="dialog"
          aria-label="Chat HSB Company"
          aria-modal="false"
        >
          {/* Header */}
          <div className={styles.chatHd}>
            <div className={styles.who}>
              <div className={styles.avatar} aria-hidden="true">H</div>
              <div>
                <div className={styles.name}>HSB Concierge</div>
                <div className={styles.status}>
                  <span className={styles.live} />
                  Online · responde em segundos
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 6 }}>
              {msgs.length > 1 && (
                <button
                  className={styles.closeBtn}
                  onClick={reset}
                  aria-label="Limpar conversa"
                  title="Limpar conversa"
                >
                  ↻
                </button>
              )}
              <button
                className={styles.closeBtn}
                onClick={() => setOpen(false)}
                aria-label="Fechar chat"
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
                aria-label="Concierge digitando"
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
                ↻ Tentar de novo
              </button>
            )}
          </div>

          {/* Quick prompts */}
          {msgs.length <= 1 && !busy && (
            <div className={styles.quick} role="group" aria-label="Sugestões rápidas">
              {QUICK_PROMPTS.map((p) => (
                <button key={p} className={styles.chip} onClick={() => send(p)}>
                  {p}
                </button>
              ))}
            </div>
          )}

          {/* Form */}
          <form
            className={styles.form}
            onSubmit={(e) => { e.preventDefault(); send(); }}
          >
            <input
              ref={inputRef}
              className={styles.input}
              placeholder="Escreva sua mensagem…"
              value={text}
              onChange={(e) => { setText(e.target.value); if (error && error !== 'retry') setError(null); }}
              aria-label="Mensagem"
              disabled={busy}
              maxLength={500}
              autoComplete="off"
            />
            <button
              className={styles.sendBtn}
              type="submit"
              disabled={busy || !text.trim()}
              aria-label="Enviar"
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
