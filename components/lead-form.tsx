'use client';

import { FormEvent, useState } from 'react';
import { ArrowUpRight, CheckCircle2 } from 'lucide-react';
import { useTranslations } from 'next-intl';

type Status = 'idle' | 'submitting' | 'success' | 'error';

export function LeadForm() {
  const [status, setStatus] = useState<Status>('idle');
  const t = useTranslations('LeadForm');

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('submitting');
    await new Promise((r) => setTimeout(r, 600));
    setStatus('success');
    e.currentTarget.reset();
  };

  const field =
    'mt-2 w-full rounded-xl border border-border/[0.1] bg-fg/[0.03] px-4 py-3 text-sm text-fg placeholder:text-fg/25 outline-none transition-colors focus:border-accent/50 focus:bg-fg/[0.05] focus:ring-2 focus:ring-accent/15';

  const label = 'flex flex-col text-[10px] sm:text-xs text-fg/35 tracking-[0.2em] uppercase';

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl border border-border/[0.08] bg-surface/40 p-5 sm:p-7">
      <div className="grid gap-4 sm:gap-5 sm:grid-cols-2">
        <label className={label}>
          {t('name')}
          <input className={field} type="text" name="name" required autoComplete="name" placeholder={t('namePlaceholder')} />
        </label>
        <label className={label}>
          {t('email')}
          <input className={field} type="email" name="email" required autoComplete="email" placeholder={t('emailPlaceholder')} />
        </label>
        <label className={`${label} sm:col-span-2`}>
          {t('phone')}
          <input className={field} type="tel" name="phone" required autoComplete="tel" placeholder={t('phonePlaceholder')} />
        </label>
        <label className={`${label} sm:col-span-2`}>
          {t('message')}
          <textarea
            className={`${field} h-28 sm:h-32 resize-none`}
            name="message"
            required
            placeholder={t('messagePlaceholder')}
          />
        </label>
      </div>

      <button
        type="submit"
        disabled={status === 'submitting' || status === 'success'}
        className="group mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-fg px-6 py-3.5 text-sm font-bold text-bg shadow-glow-sm transition disabled:opacity-60 hover:shadow-glow active:scale-[0.99]"
      >
        {status === 'submitting' && t('submitting')}
        {status === 'success' && (<><CheckCircle2 className="h-4 w-4" /> {t('success')}</>)}
        {(status === 'idle' || status === 'error') && (
          <>
            {t('submit')}
            <ArrowUpRight className="h-4 w-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </>
        )}
      </button>

      {status === 'success' && (
        <p className="mt-4 text-center text-sm text-accent">
          {t('successDetail')}
        </p>
      )}
      {status === 'error' && (
        <p className="mt-4 text-center text-sm text-red-400">
          {t('error')}
        </p>
      )}
    </form>
  );
}
