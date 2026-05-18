'use client';

import { useState } from 'react';
import { Loader2, Check, Eye, EyeOff } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

const inputClass =
  'w-full rounded-xl border border-border bg-surface-2 px-4 py-3 pr-11 text-sm text-ink placeholder:text-muted/50 outline-none transition focus:border-gold/40 focus:ring-2 focus:ring-gold/10 disabled:opacity-50';

function PasswordInput({
  value,
  onChange,
  placeholder,
  disabled,
  autoComplete,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  disabled: boolean;
  autoComplete: string;
}) {
  const [show, setShow] = useState(false);
  return (
    <div className="relative">
      <input
        type={show ? 'text' : 'password'}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        autoComplete={autoComplete}
        className={inputClass}
      />
      <button
        type="button"
        onClick={() => setShow((v) => !v)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-ink"
        tabIndex={-1}
      >
        {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
      </button>
    </div>
  );
}

export function PasswordForm() {
  const [newPass, setNewPass]       = useState('');
  const [confirmPass, setConfirm]   = useState('');
  const [status, setStatus]         = useState<'idle' | 'loading' | 'ok' | 'error'>('idle');
  const [errorMsg, setErrorMsg]     = useState('');

  const mismatch = confirmPass.length > 0 && newPass !== confirmPass;
  const tooShort = newPass.length > 0 && newPass.length < 8;
  const canSubmit = newPass.length >= 8 && newPass === confirmPass && status !== 'loading';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;

    setStatus('loading');
    setErrorMsg('');

    const { error } = await createClient().auth.updateUser({ password: newPass });

    if (error) {
      setErrorMsg(error.message);
      setStatus('error');
    } else {
      setStatus('ok');
      setNewPass('');
      setConfirm('');
      setTimeout(() => setStatus('idle'), 3000);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="mb-1.5 block text-xs font-medium uppercase tracking-[0.15em] text-muted">
          Nova senha
        </label>
        <PasswordInput
          value={newPass}
          onChange={(v) => { setNewPass(v); setStatus('idle'); }}
          placeholder="Mínimo 8 caracteres"
          disabled={status === 'loading'}
          autoComplete="new-password"
        />
        {tooShort && (
          <p className="mt-1 text-[11px] text-danger">Mínimo 8 caracteres.</p>
        )}
      </div>

      <div>
        <label className="mb-1.5 block text-xs font-medium uppercase tracking-[0.15em] text-muted">
          Confirmar nova senha
        </label>
        <PasswordInput
          value={confirmPass}
          onChange={(v) => { setConfirm(v); setStatus('idle'); }}
          placeholder="Repita a senha"
          disabled={status === 'loading'}
          autoComplete="new-password"
        />
        {mismatch && (
          <p className="mt-1 text-[11px] text-danger">As senhas não coincidem.</p>
        )}
      </div>

      {status === 'error' && (
        <p className="rounded-xl border border-danger/20 bg-danger/5 px-4 py-2.5 text-sm text-danger">
          {errorMsg}
        </p>
      )}

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={!canSubmit}
          className="inline-flex items-center gap-2 rounded-xl bg-gold px-5 py-2.5 text-sm font-bold text-bg transition hover:opacity-90 active:scale-[0.99] disabled:opacity-40"
        >
          {status === 'loading' && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
          {status === 'ok' ? 'Senha atualizada!' : 'Alterar senha'}
        </button>
        {status === 'ok' && <Check className="h-4 w-4 text-green-400" />}
      </div>
    </form>
  );
}
