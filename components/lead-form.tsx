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
    <form className="card p-6 md:p-8" onSubmit={handleSubmit}>
      <div className="grid gap-4 md:grid-cols-2">
        <label className="text-sm font-medium text-slate-300">
          Name
          <input className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none focus:border-cyan-300" type="text" name="name" required />
        </label>
        <label className="text-sm font-medium text-slate-300">
          Email
          <input className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none focus:border-cyan-300" type="email" name="email" required />
        </label>
        <label className="text-sm font-medium text-slate-300">
          Phone
          <input className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none focus:border-cyan-300" type="tel" name="phone" required />
        </label>
        <label className="text-sm font-medium text-slate-300 md:col-span-2">
          Message
          <textarea className="mt-2 h-36 w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none focus:border-cyan-300" name="message" required />
        </label>
      </div>

      <label className="mt-4 flex items-start gap-2 text-xs text-slate-400">
        <input type="checkbox" required className="mt-0.5" />
        <span>I agree to receive communications from HSB according to privacy and LGPD practices.</span>
      </label>

      <button type="submit" className="mt-5 w-full rounded-lg bg-white px-6 py-3 font-semibold text-slate-900">
        Request a Quote
      </button>
      {status === 'success' ? <p className="mt-3 text-sm text-emerald-300">Message received. Our team will contact you shortly.</p> : null}
    </form>
  );
}
