'use client';

import React, { useState, useEffect, useRef } from 'react';
import styles from './chatbot-widget.module.css';

const QUICK_PROMPTS = [
  'Quero escalar com IA',
  'Preciso de uma landing page',
  'Tráfego pago',
  'Falar com um humano',
];

type Msg = { role: 'bot' | 'user'; text: string };

export function ChatbotWidget() {
  const [open, setOpen]   = useState(false);
  const [busy, setBusy]   = useState(false);
  const [text, setText]   = useState('');
  const [msgs, setMsgs]   = useState<Msg[]>([
    { role: 'bot', text: 'Oi 👋 Aqui é o concierge da HSB. Conta um pouco do que você quer construir — tráfego, IA, marca, funil — e eu te direciono pra solução certa.' },
  ]);
  const streamRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (streamRef.current) streamRef.current.scrollTop = streamRef.current.scrollHeight;
  }, [msgs, busy, open]);

  const send = async (raw?: string) => {
    const q = (raw ?? text).trim();
    if (!q || busy) return;
    setText('');
    const next: Msg[] = [...msgs, { role: 'user', text: q }];
    setMsgs(next);
    setBusy(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: q }),
      });
      if (res.ok) {
        const data = await res.json();
        setMsgs(m => [...m, { role: 'bot', text: data.reply || 'Recebemos sua mensagem. Um especialista entrará em contato em breve!' }]);
      } else throw new Error();
    } catch {
      setMsgs(m => [...m, {
        role: 'bot',
        text: 'Tive um problema aqui. Mas pode nos chamar diretamente pelo botão "Vamos conversar" no topo.',
      }]);
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      {!open && (
        <button className={styles.fab} onClick={() => setOpen(true)} aria-label="Abrir chat com a HSB">
          <span className={styles.pulse} aria-hidden="true" />
          Vamos conversar
        </button>
      )}

      {open && (
        <div className={styles.chat} role="dialog" aria-label="Chat HSB Company">
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
            <button className={styles.closeBtn} onClick={() => setOpen(false)} aria-label="Fechar chat">✕</button>
          </div>

          {/* Stream */}
          <div className={styles.stream} ref={streamRef}>
            {msgs.map((m, i) => (
              <div key={i} className={`${styles.msg} ${m.role === 'user' ? styles.user : styles.bot}`}>
                {m.text}
              </div>
            ))}
            {busy && (
              <div className={`${styles.msg} ${styles.bot} ${styles.thinking}`} aria-label="Digitando">
                <i /><i /><i />
              </div>
            )}
          </div>

          {/* Quick prompts */}
          {msgs.length <= 1 && !busy && (
            <div className={styles.quick} role="group" aria-label="Sugestões rápidas">
              {QUICK_PROMPTS.map(p => (
                <button key={p} className={styles.chip} onClick={() => send(p)}>{p}</button>
              ))}
            </div>
          )}

          {/* Form */}
          <form className={styles.form} onSubmit={(e) => { e.preventDefault(); send(); }}>
            <input
              className={styles.input}
              placeholder="Escreva sua mensagem…"
              value={text}
              onChange={(e) => setText(e.target.value)}
              aria-label="Mensagem"
              disabled={busy}
            />
            <button className={styles.sendBtn} type="submit" disabled={busy || !text.trim()} aria-label="Enviar">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </button>
          </form>
        </div>
      )}
    </>
  );
}
