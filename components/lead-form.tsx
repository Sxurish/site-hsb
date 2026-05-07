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

  const inputClass =
    'mt-2 w-full rounded-xl border border-white/[0.1] bg-white/[0.03] px-4 py-3 text-sm text-white placeholder:text-white/20 outline-none focus:border-white/25 transition-colors';

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid gap-5 md:grid-cols-2">
        <label className="flex flex-col text-xs text-white/30 tracking-[0.2em] uppercase">
          Name
          <input className={inputClass} type="text" name="name" required placeholder="Your full name" />
        </label>
        <label className="flex flex-col text-xs text-white/30 tracking-[0.2em] uppercase">
          Email
          <input className={inputClass} type="email" name="email" required placeholder="you@brand.com" />
        </label>
        <label className="flex flex-col text-xs text-white/30 tracking-[0.2em] uppercase md:col-span-2">
          Phone
          <input className={inputClass} type="tel" name="phone" required placeholder="+55 (11) 99999-9999" />
        </label>
        <label className="flex flex-col text-xs text-white/30 tracking-[0.2em] uppercase md:col-span-2">
          Message
          <textarea
            className={`${inputClass} h-32 resize-none`}
            name="message"
            required
            placeholder="What are your main goals for the next 90 days?"
          />
        </label>
      </div>

      <button
        type="submit"
        className="mt-6 w-full rounded-xl bg-white text-black px-6 py-3.5 text-sm font-bold transition hover:bg-white/90"
      >
        Request a Quote
      </button>

      {status === 'success' && (
        <p className="mt-4 text-sm text-white/45">
          Thanks! Your message was received. We&apos;ll reach out shortly.
        </p>
      )}
    </form>
  );
}
