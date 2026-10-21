import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  theme: {
    extend: {
      colors: {
        premium: {
          black: '#0d0d0d',
          gold: '#c9a45b',
          goldSoft: '#e6d1a2',
          paper: '#f7f3ee',
          panel: '#1a1a1a'
        }
      },
      fontFamily: {
        sans: ['var(--font-sans)']
      },
      boxShadow: {
        glow: '0 20px 50px rgba(201, 164, 91, 0.18)'
      }
    }
  },
  plugins: []
};

export default config;
