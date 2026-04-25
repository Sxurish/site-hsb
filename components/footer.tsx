import { Instagram, Linkedin, Youtube } from 'lucide-react';
import { BrandLogo } from './brand-logo';

export function Footer() {
  return (
    <footer className="border-t border-slate-800 bg-slate-950">
      <div className="container-shell flex flex-col gap-6 py-10 md:flex-row md:items-center md:justify-between">
        <div>
          <BrandLogo compact />
          <p className="mt-2 text-sm text-slate-400">Marketing & Audiovisual Agency · São Paulo, Brazil</p>
          <p className="text-sm text-slate-400">hello@hsbcompany.com · +55 (11) 99999-9999</p>
        </div>
        <div className="flex items-center gap-2">
          {[Instagram, Linkedin, Youtube].map((Icon, idx) => (
            <a key={idx} href="#" className="rounded-lg border border-slate-700 p-2 text-slate-400 hover:text-white">
              <Icon className="h-4 w-4" />
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
