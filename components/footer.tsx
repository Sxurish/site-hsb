import { Instagram, Linkedin, Youtube } from 'lucide-react';
import { BrandLogo } from './brand-logo';

const socials = [Instagram, Linkedin, Youtube];

export function Footer() {
  return (
    <footer className="border-t border-white/[0.08]">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-12 md:flex-row md:items-end md:justify-between md:px-8">
        <div>
          <BrandLogo />
          <p className="mt-4 text-sm text-white/30">Digital + Audiovisual Growth Agency</p>
          <p className="text-sm text-white/30">São Paulo, Brazil</p>
        </div>

        <div className="flex flex-col md:items-end gap-4">
          <div className="flex items-center gap-2">
            {socials.map((Icon, idx) => (
              <a
                key={idx}
                href="#"
                className="rounded-full border border-white/[0.1] p-2 text-white/35 transition hover:border-white/25 hover:text-white/70"
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
          <p className="text-xs text-white/20">
            © {new Date().getFullYear()} HSB Company. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
