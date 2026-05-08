'use client';

import { FormEvent, useState } from 'react';

type Status = 'idle' | 'success';

export function LeadForm() {
  const [status, setStatus] = useState<Status>('idle');

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('success');
    e.currentTarget.reset();
  };

  const field =
    'mt-2 w-full rounded-xl border border-border/[0.1] bg-fg/[0.03] px-4 py-3 text-sm text-fg placeholder:text-fg/20 outline-none focus:border-accent/40 focus:bg-fg/[0.05] transition-colors';

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid gap-5 md:grid-cols-2">
        <label className="flex flex-col text-xs text-fg/30 tracking-[0.2em] uppercase">
          Nome
          <input className={field} type="text" name="name" required placeholder="Seu nome completo" />
        </label>
        <label className="flex flex-col text-xs text-fg/30 tracking-[0.2em] uppercase">
          E-mail
          <input className={field} type="email" name="email" required placeholder="voce@empresa.com" />
        </label>
        <label className="flex flex-col text-xs text-fg/30 tracking-[0.2em] uppercase md:col-span-2">
          Telefone
          <input className={field} type="tel" name="phone" required placeholder="+55 (11) 99999-9999" />
        </label>
        <label className="flex flex-col text-xs text-fg/30 tracking-[0.2em] uppercase md:col-span-2">
          Mensagem
          <textarea
            className={`${field} h-32 resize-none`}
            name="message"
            required
            placeholder="Quais são seus principais objetivos para os próximos 90 dias?"
          />
        </label>
      </div>

      <button
        type="submit"
        className="mt-6 w-full rounded-xl bg-fg px-6 py-3.5 text-sm font-bold text-bg transition hover:opacity-85"
      >
        Solicitar Orçamento
      </button>

      {status === 'success' && (
        <p className="mt-4 text-sm text-accent">
          Obrigado! Sua mensagem foi recebida. Entraremos em contato em breve.
        </p>
      )}
    </form>
  );
}
