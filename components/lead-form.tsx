'use client';

import { FormEvent, useMemo, useRef, useState } from 'react';
import { ArrowUpRight, CheckCircle2 } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { track } from '@/lib/analytics';

type Status = 'idle' | 'submitting' | 'success' | 'error';

// País do número (ISO 3166-1) + código de discagem internacional.
// Nomes exibidos vêm de Intl.DisplayNames no idioma da página.
const COUNTRIES: { code: string; dial: string }[] = [
  { code: 'BR', dial: '55' },  { code: 'PT', dial: '351' }, { code: 'US', dial: '1' },
  { code: 'CA', dial: '1' },   { code: 'MX', dial: '52' },  { code: 'AR', dial: '54' },
  { code: 'CL', dial: '56' },  { code: 'CO', dial: '57' },  { code: 'PE', dial: '51' },
  { code: 'UY', dial: '598' }, { code: 'PY', dial: '595' }, { code: 'BO', dial: '591' },
  { code: 'EC', dial: '593' }, { code: 'VE', dial: '58' },  { code: 'ES', dial: '34' },
  { code: 'FR', dial: '33' },  { code: 'DE', dial: '49' },  { code: 'IT', dial: '39' },
  { code: 'GB', dial: '44' },  { code: 'IE', dial: '353' }, { code: 'NL', dial: '31' },
  { code: 'BE', dial: '32' },  { code: 'CH', dial: '41' },  { code: 'AT', dial: '43' },
  { code: 'SE', dial: '46' },  { code: 'NO', dial: '47' },  { code: 'DK', dial: '45' },
  { code: 'PL', dial: '48' },  { code: 'CN', dial: '86' },  { code: 'JP', dial: '81' },
  { code: 'KR', dial: '82' },  { code: 'IN', dial: '91' },  { code: 'AU', dial: '61' },
  { code: 'NZ', dial: '64' },  { code: 'AE', dial: '971' }, { code: 'IL', dial: '972' },
  { code: 'ZA', dial: '27' },
];

// País pré-selecionado conforme o idioma da página.
const DEFAULT_COUNTRY: Record<string, string> = {
  'pt-BR': 'BR', en: 'US', es: 'ES', fr: 'FR', de: 'DE', 'zh-CN': 'CN',
};

// 'BR' → 🇧🇷 (regional indicator symbols)
function flagEmoji(code: string): string {
  return String.fromCodePoint(...[...code].map((c) => 0x1f1e6 + c.charCodeAt(0) - 65));
}

export function LeadForm() {
  const [status, setStatus] = useState<Status>('idle');
  const startedRef = useRef(false);
  const t = useTranslations('LeadForm');
  const locale = useLocale();
  const [country, setCountry] = useState(() => DEFAULT_COUNTRY[locale] ?? 'BR');

  // Nomes de país localizados pelo próprio runtime (sem lista traduzida à mão).
  const countryOptions = useMemo(() => {
    let names: Intl.DisplayNames | null = null;
    try { names = new Intl.DisplayNames([locale], { type: 'region' }); } catch { /* fallback: código */ }
    const list = COUNTRIES
      .map((c) => ({ ...c, name: names?.of(c.code) ?? c.code }))
      .sort((a, b) => a.name.localeCompare(b.name, locale));
    // País padrão vai pro topo: o SSR do React não emite `selected`, então o
    // browser mostra a primeira opção até hidratar — que assim já é a certa.
    const def = DEFAULT_COUNTRY[locale] ?? 'BR';
    const i = list.findIndex((c) => c.code === def);
    if (i > 0) list.unshift(list.splice(i, 1)[0]!);
    return list;
  }, [locale]);

  const handleFirstFocus = () => {
    if (startedRef.current) return;
    startedRef.current = true;
    track('lead_form_started');
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    // Telefone completo no padrão internacional: +<código do país> <DDD + número>
    const dial = COUNTRIES.find((c) => c.code === country)?.dial ?? '55';
    const phoneRaw = String(fd.get('phone') ?? '').trim();
    const payload = {
      name:    String(fd.get('name')    ?? '').trim(),
      email:   String(fd.get('email')   ?? '').trim(),
      phone:   phoneRaw ? `+${dial} ${phoneRaw}` : '',
      message: String(fd.get('message') ?? '').trim(),
      website: String(fd.get('website') ?? '').trim(), // honeypot — humano nunca preenche
      locale,
    };

    setStatus('submitting');
    try {
      const res = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => null) as { ok?: boolean } | null;

      if (res.ok && data?.ok) {
        setStatus('success');
        track('lead_form_submitted', {
          hasEmail: !!payload.email,
          hasPhone: !!payload.phone,
        });
        form.reset();
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  const fieldBase =
    'rounded-xl border border-border/[0.1] bg-fg/[0.03] px-4 py-3 text-sm text-fg placeholder:text-fg/25 outline-none transition-colors focus:border-accent/50 focus:bg-fg/[0.05] focus:ring-2 focus:ring-accent/15';
  const field = `mt-2 w-full ${fieldBase}`;

  const label = 'flex flex-col text-[10px] sm:text-xs text-fg/35 tracking-[0.2em] uppercase';

  return (
    <form
      onSubmit={handleSubmit}
      onFocus={handleFirstFocus}
      className="relative rounded-2xl border border-border/[0.08] bg-surface/40 p-5 sm:p-7"
    >
      {/* Honeypot anti-spam: invisível e fora do fluxo de foco/leitores de tela */}
      <div className="absolute h-0 w-0 overflow-hidden opacity-0" aria-hidden="true">
        <label>
          Website
          <input type="text" name="website" tabIndex={-1} autoComplete="off" defaultValue="" />
        </label>
      </div>

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
          <div className="mt-2 flex gap-2">
            <select
              name="phoneCountry"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              aria-label={t('country')}
              className={`${fieldBase} w-[42%] max-w-[13rem] shrink-0 cursor-pointer`}
            >
              {countryOptions.map((c) => (
                <option key={c.code} value={c.code}>
                  {flagEmoji(c.code)} {c.name} (+{c.dial})
                </option>
              ))}
            </select>
            <input
              className={`${fieldBase} min-w-0 flex-1`}
              type="tel"
              name="phone"
              required
              autoComplete="tel-national"
              inputMode="tel"
              placeholder={t('phonePlaceholder')}
            />
          </div>
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
