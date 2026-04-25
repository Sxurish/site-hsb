type BrandLogoProps = {
  compact?: boolean;
};

export function BrandLogo({ compact = false }: BrandLogoProps) {
  const size = compact ? 30 : 42;
  return (
    <div className="inline-flex items-center gap-2.5">
      <svg width={size} height={size} viewBox="0 0 80 80" fill="none" aria-hidden="true">
        <defs>
          <linearGradient id="hsbGrad" x1="0" y1="0" x2="80" y2="80" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#E91E8C" />
            <stop offset="50%" stopColor="#FF6B2C" />
            <stop offset="100%" stopColor="#FFD426" />
          </linearGradient>
        </defs>

        {/* Top arc / crown */}
        <path
          d="M24 34 Q24 12 40 12 Q56 12 56 34"
          stroke="url(#hsbGrad)"
          strokeWidth="5.5"
          strokeLinecap="round"
          fill="none"
        />

        {/* Left arm sweeping down */}
        <path
          d="M24 34 Q16 44 12 58"
          stroke="url(#hsbGrad)"
          strokeWidth="5.5"
          strokeLinecap="round"
          fill="none"
        />

        {/* Right arm sweeping down */}
        <path
          d="M56 34 Q64 44 68 58"
          stroke="url(#hsbGrad)"
          strokeWidth="5.5"
          strokeLinecap="round"
          fill="none"
        />

        {/* Center dot */}
        <circle cx="40" cy="34" r="5" fill="url(#hsbGrad)" />

        {/* Left endpoint dot */}
        <circle cx="12" cy="58" r="4" fill="url(#hsbGrad)" />

        {/* Right endpoint dot */}
        <circle cx="68" cy="58" r="4" fill="url(#hsbGrad)" />

        {/* Top-left dot */}
        <circle cx="24" cy="14" r="3" fill="url(#hsbGrad)" />

        {/* Top-right dot */}
        <circle cx="56" cy="14" r="3" fill="url(#hsbGrad)" />
      </svg>

      <div className="flex flex-col leading-none">
        <span
          className={`${compact ? 'text-xl' : 'text-2xl'} font-black tracking-[0.18em] text-white`}
          style={{ letterSpacing: '0.18em' }}
        >
          HSB
        </span>
        {!compact && (
          <span
            className="text-[8px] tracking-[0.3em] uppercase font-medium mt-0.5"
            style={{
              background: 'linear-gradient(90deg, #E91E8C, #FF6B2C, #FFD426)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Company
          </span>
        )}
      </div>
    </div>
  );
}
