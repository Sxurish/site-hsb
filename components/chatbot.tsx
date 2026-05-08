'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { Bot, MessageCircle, Send, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

const WEBHOOK = 'https://kaykywbraz.app.n8n.cloud/webhook/07948f96-2fac-4225-aaef-7b9d0cd37c99';

const GREETING =
  'Olá! Sou a Aria, assistente da HSB Company 👋\n\nPosso te ajudar a entender como podemos acelerar o crescimento do seu negócio. O que você está buscando?';

type Message = { id: string; role: 'user' | 'bot'; text: string };

function uid() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export function Chatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: 'g0', role: 'bot', text: GREETING },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const sessionId = useRef(uid());
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 320);
  }, [open]);

  const send = async () => {
    const text = input.trim();
    if (!text || loading) return;

    setMessages(prev => [...prev, { id: uid(), role: 'user', text }]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch(WEBHOOK, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          sessionId: sessionId.current,
          timestamp: new Date().toISOString(),
        }),
      });

      const data = await res.json().catch(() => ({}));
      const reply =
        data.reply ?? data.output ?? data.text ?? data.message ??
        'Desculpe, tive um problema técnico. Tente novamente em instantes.';

      setMessages(prev => [...prev, { id: uid(), role: 'bot', text: reply }]);
    } catch {
      setMessages(prev => [
        ...prev,
        { id: uid(), role: 'bot', text: 'Ops, não consegui me conectar. Tente novamente.' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); }
  };

  return (
    <>
      {/* ── Floating button ── */}
      <AnimatePresence>
        {!open && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 320, damping: 22 }}
            onClick={() => setOpen(true)}
            className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 rounded-full bg-accent px-5 py-3 text-sm font-bold text-white shadow-glow hover:opacity-90 transition-opacity"
            aria-label="Falar com Aria"
          >
            <MessageCircle className="h-4 w-4" />
            Falar com Aria
          </motion.button>
        )}
      </AnimatePresence>

      {/* ── Chat panel ── */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 28, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 28, scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 340, damping: 28 }}
            className="fixed bottom-6 right-6 z-50 flex flex-col overflow-hidden rounded-2xl border border-border/[0.1] bg-surface shadow-2xl"
            style={{ width: 360, maxWidth: 'calc(100vw - 2rem)', height: 540 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border/[0.08] px-4 py-3 shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent/15">
                  <Bot className="h-4 w-4 text-accent" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-fg">Aria</p>
                  <div className="flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                    <p className="text-xs text-fg/35">HSB Company · Online</p>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                aria-label="Fechar chat"
                className="rounded-lg p-1.5 text-fg/35 hover:text-fg transition"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25 }}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[82%] whitespace-pre-wrap rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                      msg.role === 'user'
                        ? 'rounded-br-sm bg-accent text-white'
                        : 'rounded-bl-sm bg-fg/[0.06] text-fg'
                    }`}
                  >
                    {msg.text}
                  </div>
                </motion.div>
              ))}

              {/* Typing indicator */}
              {loading && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-start"
                >
                  <div className="flex items-center gap-1 rounded-2xl rounded-bl-sm bg-fg/[0.06] px-4 py-3">
                    {[0, 1, 2].map((i) => (
                      <span
                        key={i}
                        className="h-1.5 w-1.5 rounded-full bg-fg/30 animate-bounce"
                        style={{ animationDelay: `${i * 0.15}s` }}
                      />
                    ))}
                  </div>
                </motion.div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div className="shrink-0 border-t border-border/[0.08] px-3 py-3 flex items-end gap-2">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={onKeyDown}
                placeholder="Digite sua mensagem..."
                rows={1}
                className="flex-1 resize-none rounded-xl bg-fg/[0.05] px-3.5 py-2.5 text-sm text-fg placeholder:text-fg/25 outline-none focus:bg-fg/[0.08] transition max-h-24"
                style={{ lineHeight: '1.5' }}
              />
              <button
                onClick={send}
                disabled={!input.trim() || loading}
                aria-label="Enviar"
                className="shrink-0 flex h-9 w-9 items-center justify-center rounded-xl bg-accent text-white transition hover:opacity-85 disabled:opacity-30"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
