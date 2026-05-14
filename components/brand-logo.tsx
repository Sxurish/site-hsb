import Image from 'next/image';

type BrandLogoProps = {
  compact?: boolean;
  large?: boolean;
};

export function BrandLogo({ compact = false, large = false }: BrandLogoProps) {
  const width = compact ? '8rem' : large ? '14rem' : '11rem';
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
        width,
        height: 'auto',
      }}
    />
  );
}
