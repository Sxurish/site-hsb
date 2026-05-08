import { Instagram, Linkedin, Youtube } from 'lucide-react';
import { BrandLogo } from './brand-logo';

const socials = [
  { Icon: Instagram, href: '#', label: 'Instagram' },
  { Icon: Linkedin,  href: '#', label: 'LinkedIn' },
  { Icon: Youtube,   href: '#', label: 'YouTube' },
];

export function Footer() {
  return (
    <footer className="border-t border-border/[0.08]">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-12 md:flex-row md:items-end md:justify-between md:px-8">
        <div>
          <BrandLogo />
          <p className="mt-4 text-sm text-fg/30">Agência de Marketing Digital & Audiovisual</p>
          <p className="text-sm text-fg/30">São Paulo, Brasil</p>
        </div>

        <div className="flex flex-col md:items-end gap-4">
          <div className="flex items-center gap-2">
            {socials.map(({ Icon, href, label }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                className="flex h-8 w-8 items-center justify-center rounded-full border border-border/[0.1] text-fg/35 transition hover:border-border/25 hover:text-fg/70"
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
          <p className="text-xs text-fg/20">
            © {new Date().getFullYear()} HSB Company. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
