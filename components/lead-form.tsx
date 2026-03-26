'use client';

import { FormEvent, useState } from 'react';

type Status = 'idle' | 'success';

export function LeadForm() {
  const [status, setStatus] = useState<Status>('idle');

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus('success');
    event.currentTarget.reset();
  };

  return (
    <form className="glass-card neon-outline rounded-3xl p-6 md:p-8" onSubmit={handleSubmit}>
      <div className="grid gap-4 md:grid-cols-2">
        <label className="text-sm">
          Name
          <input
            className="mt-2 w-full rounded-xl border border-white/20 bg-black/40 px-4 py-3 outline-none ring-hotPink/70 focus:ring"
            type="text"
            name="name"
            required
            placeholder="Your full name"
          />
        </label>
        <label className="text-sm">
          Email
          <input
            className="mt-2 w-full rounded-xl border border-white/20 bg-black/40 px-4 py-3 outline-none ring-hotPink/70 focus:ring"
            type="email"
            name="email"
            required
            placeholder="you@brand.com"
          />
        </label>
        <label className="text-sm">
          Phone
          <input
            className="mt-2 w-full rounded-xl border border-white/20 bg-black/40 px-4 py-3 outline-none ring-hotPink/70 focus:ring"
            type="tel"
            name="phone"
            required
            placeholder="+55 (11) 99999-9999"
          />
        </label>
        <label className="text-sm md:col-span-2">
          Message
          <textarea
            className="mt-2 h-36 w-full rounded-xl border border-white/20 bg-black/40 px-4 py-3 outline-none ring-hotPink/70 focus:ring"
            name="message"
            required
            placeholder="What are your main goals for the next 90 days?"
          />
        </label>
      </div>
      <button
        type="submit"
        className="mt-5 w-full rounded-xl bg-hotPink px-6 py-3 font-bold text-black transition hover:brightness-110"
      >
        Request a Quote
      </button>
      {status === 'success' ? (
        <p className="mt-3 text-sm text-acidGreen">Thanks! Your message was received. We&apos;ll reach out shortly.</p>
      ) : null}
    </form>
  );
}
