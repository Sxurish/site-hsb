import Image from 'next/image';

type BrandLogoProps = {
  compact?: boolean;
};

export function BrandLogo({ compact = false }: BrandLogoProps) {
  return (
    <Image
      src="/logo.png"
      alt="HSB Company"
      width={1536}
      height={1024}
      priority
      className="brand-logo-mark"
      style={{
        objectFit: 'contain',
        width: compact ? '6rem' : '8.5rem',
        height: 'auto',
      }}
    />
  );
}
