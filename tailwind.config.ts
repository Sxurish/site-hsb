import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        bg:           'rgb(var(--bg)            / <alpha-value>)',
        surface:      'rgb(var(--surface)       / <alpha-value>)',
        fg:           'rgb(var(--fg)            / <alpha-value>)',
        border:       'rgb(var(--border)        / <alpha-value>)',
        accent:       'rgb(var(--accent)        / <alpha-value>)',
        'accent-soft':'rgb(var(--accent-soft)   / <alpha-value>)',
        muted:        'rgb(var(--muted)         / <alpha-value>)',
      },
      fontFamily: {
        serif: ['var(--font-serif)', 'ui-serif', 'Georgia', 'serif'],
        sans:  ['var(--font-sans)',  'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono:  ['var(--font-mono)',  'ui-monospace', 'monospace'],
      },
      boxShadow: {
        glow:    '0 0 80px rgb(var(--accent) / 0.28)',
        'glow-sm':'0 0 32px rgb(var(--accent) / 0.22)',
        'inner-line': 'inset 0 0 0 1px rgb(var(--border) / 0.12)',
      },
      keyframes: {
        'fade-up':   { '0%': { opacity: '0', transform: 'translateY(14px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
        'fade-in':   { '0%': { opacity: '0' },                                '100%': { opacity: '1' } },
        'shimmer':   { '0%': { backgroundPosition: '-200% 0' },               '100%': { backgroundPosition: '200% 0' } },
      },
      animation: {
        'fade-up': 'fade-up 0.7s cubic-bezier(0.16, 1, 0.3, 1) both',
        'fade-in': 'fade-in 0.5s ease-out both',
        'shimmer': 'shimmer 3s linear infinite',
      },
    }
  },
  plugins: []
};

export default config;
