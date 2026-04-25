import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  theme: {
    extend: {
      colors: {
        surface: '#05050A',
        neonPurple: '#8f3dfd',
        neonBlue: '#2f7dff',
        hotPink: '#ff2d9a',
        acidGreen: '#b9ff2d',
        brightCyan: '#00e5ff'
      },
      boxShadow: {
        neon: '0 0 30px rgba(143, 61, 253, 0.45)',
        cyan: '0 0 28px rgba(0, 229, 255, 0.35)'
      },
      backgroundImage: {
        grid: 'linear-gradient(to right, rgba(255,255,255,.07) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,.07) 1px, transparent 1px)'
      }
    }
  },
  plugins: []
};

export default config;
