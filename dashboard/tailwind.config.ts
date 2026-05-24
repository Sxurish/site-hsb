import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
    './hooks/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        bg:       '#0c0b0a',
        surface:  '#131110',
        'surface-2': '#1c1916',
        gold:     '#d4a566',
        'gold-dim': 'rgba(212,165,102,0.12)',
        ink:      '#f5f2ee',
        muted:    'rgba(245,242,238,0.4)',
        border:   'rgba(255,255,255,0.07)',
        'border-strong': 'rgba(255,255,255,0.14)',
        success:  '#4ade80',
        danger:   '#f87171',
        warning:  '#fbbf24',
        info:     '#60a5fa',
      },
      fontFamily: {
        sans: ['Inter Tight', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        card:   '0 1px 3px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.05)',
        glow:   '0 0 20px rgba(212,165,102,0.15)',
        'glow-sm': '0 0 10px rgba(212,165,102,0.1)',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease forwards',
        'slide-up': 'slideUp 0.4s ease forwards',
      },
      keyframes: {
        fadeIn:  { from: { opacity: '0' }, to: { opacity: '1' } },
        slideUp: { from: { opacity: '0', transform: 'translateY(8px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
      },
    },
  },
};
export default config;
