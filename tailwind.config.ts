import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  theme: {
    extend: {
      colors: {
        surface: '#080810',
        brand: '#E91E8C',
        brandOrange: '#FF6B2C',
        brandGold: '#FFD426',
        brandPink: '#E91E8C',
        hotPink: '#E91E8C',
        acidGreen: '#FFD426',
        brightCyan: '#FF6B2C'
      },
      boxShadow: {
        neon: '0 0 30px rgba(233, 30, 140, 0.45)',
        cyan: '0 0 28px rgba(255, 107, 44, 0.35)'
      },
      backgroundImage: {
        grid: 'linear-gradient(to right, rgba(255,255,255,.07) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,.07) 1px, transparent 1px)'
      }
    }
  },
  plugins: []
};

export default config;
