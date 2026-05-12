import { ImageResponse } from 'next/og';

export const alt = 'HSB Company — Agência de Marketing & Audiovisual em São Paulo';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

type Copy = { eyebrow: string; title: string; subtitle: string; location: string };

const COPY: Record<string, Copy> = {
  'pt-BR': {
    eyebrow: 'HSB COMPANY',
    title: 'Marketing & Audiovisual',
    subtitle: 'Performance digital e produção premium para marcas que querem crescer.',
    location: 'São Paulo · Brasil',
  },
  en: {
    eyebrow: 'HSB COMPANY',
    title: 'Marketing & Audiovisual',
    subtitle: 'Performance marketing and premium production for brands ready to scale.',
    location: 'São Paulo · Brazil',
  },
  es: {
    eyebrow: 'HSB COMPANY',
    title: 'Marketing & Audiovisual',
    subtitle: 'Marketing de performance y producción premium para marcas ambiciosas.',
    location: 'São Paulo · Brasil',
  },
  fr: {
    eyebrow: 'HSB COMPANY',
    title: 'Marketing & Audiovisuel',
    subtitle: 'Marketing de performance et production premium pour des marques ambitieuses.',
    location: 'São Paulo · Brésil',
  },
  de: {
    eyebrow: 'HSB COMPANY',
    title: 'Marketing & Audiovisuell',
    subtitle: 'Performance-Marketing und Premium-Produktion für ambitionierte Marken.',
    location: 'São Paulo · Brasilien',
  },
  'zh-CN': {
    eyebrow: 'HSB COMPANY',
    title: '营销 与 影音制作',
    subtitle: '为雄心勃勃的品牌提供高效数字营销与优质内容制作。',
    location: '圣保罗 · 巴西',
  },
};

export default function Image({ params }: { params: { locale: string } }) {
  const copy = COPY[params.locale] ?? COPY['pt-BR']!;

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '72px 80px',
          backgroundColor: '#0c0b0a',
          backgroundImage:
            'radial-gradient(circle at 22% 18%, rgba(214,170,108,0.22), transparent 55%), radial-gradient(circle at 82% 88%, rgba(214,170,108,0.12), transparent 55%)',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          color: '#faf9f6',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: 18,
              background: 'linear-gradient(135deg, #d6aa6c 0%, #b88752 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 34,
              fontWeight: 800,
              color: '#0c0b0a',
              letterSpacing: '-0.04em',
            }}
          >
            H
          </div>
          <div
            style={{
              display: 'flex',
              fontSize: 28,
              fontWeight: 600,
              letterSpacing: '0.18em',
              color: 'rgba(250,249,246,0.72)',
            }}
          >
            {copy.eyebrow}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <div
            style={{
              display: 'flex',
              fontSize: 104,
              fontWeight: 800,
              letterSpacing: '-0.045em',
              lineHeight: 1.0,
            }}
          >
            {copy.title}
          </div>
          <div
            style={{
              display: 'flex',
              fontSize: 34,
              fontWeight: 400,
              lineHeight: 1.28,
              color: 'rgba(250,249,246,0.72)',
              maxWidth: 980,
            }}
          >
            {copy.subtitle}
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingTop: 28,
            borderTop: '1px solid rgba(250,249,246,0.12)',
          }}
        >
          <div
            style={{
              display: 'flex',
              fontSize: 24,
              fontWeight: 500,
              color: 'rgba(250,249,246,0.6)',
            }}
          >
            hsb.company
          </div>
          <div
            style={{
              display: 'flex',
              fontSize: 24,
              fontWeight: 500,
              color: 'rgba(250,249,246,0.6)',
            }}
          >
            {copy.location}
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
