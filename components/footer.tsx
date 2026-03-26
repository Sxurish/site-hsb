import { Instagram, Linkedin, Youtube } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-black/40">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-10 md:flex-row md:items-center md:justify-between md:px-8">
        <div>
          <p className="text-lg font-black">AGENCY_NAME</p>
          <p className="text-sm text-white/70">São Paulo, Brazil · Digital + Audiovisual Growth Agency</p>
          <p className="text-sm text-white/70">+55 (11) 99999-9999 · hello@agencyname.com</p>
        </div>
        <div className="flex items-center gap-3">
          {[Instagram, Linkedin, Youtube].map((Icon, idx) => (
            <a key={idx} href="#" className="rounded-full border border-white/20 p-2 text-white/80 transition hover:border-brightCyan hover:text-brightCyan">
              <Icon className="h-5 w-5" />
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
