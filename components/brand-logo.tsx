type BrandLogoProps = {
  compact?: boolean;
};

export function BrandLogo({ compact = false }: BrandLogoProps) {
  return (
    <div className="inline-flex items-center gap-3">
      <svg width={compact ? 28 : 38} height={compact ? 28 : 38} viewBox="0 0 72 72" fill="none" aria-hidden="true">
        <defs>
          <linearGradient id="hsbGradient" x1="10" y1="6" x2="62" y2="66" gradientUnits="userSpaceOnUse">
            <stop stopColor="#EC4899" />
            <stop offset="0.55" stopColor="#A855F7" />
            <stop offset="1" stopColor="#22D3EE" />
          </linearGradient>
        </defs>
        <path
          d="M36 10C22 10 13 20 13 32V43C13 50 18 55 24 55C28 55 31 52 31 48V41"
          stroke="url(#hsbGradient)"
          strokeWidth="6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path d="M36 10C50 10 59 20 59 32V43C59 50 54 55 48 55C44 55 41 52 41 48V41" stroke="url(#hsbGradient)" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="36" cy="30" r="4.5" fill="url(#hsbGradient)" />
      </svg>
      <span className={`${compact ? 'text-xl' : 'text-3xl'} font-semibold tracking-[0.14em] text-white`}>HSB</span>
    </div>
  );
}
