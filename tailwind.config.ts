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
        bg:      'rgb(var(--bg)      / <alpha-value>)',
        surface: 'rgb(var(--surface) / <alpha-value>)',
        fg:      'rgb(var(--fg)      / <alpha-value>)',
        border:  'rgb(var(--border)  / <alpha-value>)',
        accent:  'rgb(var(--accent)  / <alpha-value>)',
      },
      boxShadow: {
        glow: '0 0 60px rgb(var(--accent) / 0.25)',
      },
    }
  },
  plugins: []
};

export default config;
