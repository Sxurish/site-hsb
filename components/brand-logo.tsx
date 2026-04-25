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
      style={{
        objectFit: 'contain',
        width: compact ? '4rem' : '6rem',
        height: 'auto',
      }}
    />
  );
}
