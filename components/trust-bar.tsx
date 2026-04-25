import { ShieldCheck } from 'lucide-react';
import { trustItems } from '@/data/site';

export function TrustBar() {
  return (
    <section className="border-y border-slate-800 bg-slate-950">
      <div className="container-shell grid gap-3 py-5 md:grid-cols-4">
        {trustItems.map((item) => (
          <p key={item} className="flex items-center gap-2 text-sm text-slate-300">
            <ShieldCheck className="h-4 w-4 text-cyan-300" />
            {item}
          </p>
        ))}
      </div>
    </section>
  );
}
