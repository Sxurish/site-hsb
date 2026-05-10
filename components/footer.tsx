import { Instagram, Linkedin, PlaySquare } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { BrandLogo } from './brand-logo';

export function Footer() {
  const t = useTranslations('Footer');

  const socials = [
    { Icon: Instagram,  href: '#', label: t('social.instagram') },
    { Icon: Linkedin,   href: '#', label: t('social.linkedin') },
    { Icon: PlaySquare, href: '#', label: t('social.youtube') },
  ];

  return (
    <footer className="border-t border-border/[0.08]">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-12 md:flex-row md:items-end md:justify-between md:px-8">
        <div>
          <BrandLogo />
          <p className="mt-4 text-sm text-fg/30">{t('tagline')}</p>
          <p className="text-sm text-fg/30">{t('location')}</p>
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
            {t('copyright', { year: new Date().getFullYear() })}
          </p>
        </div>
      </div>
    </footer>
  );
}
