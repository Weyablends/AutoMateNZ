import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        forge: {
          bg: '#09090E',
          surface: '#111118',
          panel: '#17171F',
          'panel-hover': '#1D1D27',
          border: '#242432',
          'border-light': '#2E2E3E',
          accent: '#5B7FFF',
          'accent-hover': '#7A96FF',
          'accent-muted': '#1E2A5E',
          text: '#E4E4F0',
          muted: '#6B6B84',
          dim: '#4A4A60',
          success: '#3DD68C',
          'success-muted': '#0D2E1E',
          warning: '#F59E0B',
          'warning-muted': '#2A1D06',
          error: '#F04438',
          'error-muted': '#2A0E0A',
          info: '#38BDF8',
          trim: '#FF3B30',
          bleed: '#FF6B35',
          safe: '#34C759',
        },
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        mono: ['JetBrains Mono', 'Menlo', 'Monaco', 'monospace'],
      },
      fontSize: {
        '2xs': ['0.65rem', { lineHeight: '0.9rem' }],
        xs: ['0.7rem', { lineHeight: '1rem' }],
        sm: ['0.8rem', { lineHeight: '1.15rem' }],
      },
      animation: {
        'fade-in': 'fadeIn 0.2s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 2s linear infinite',
        shimmer: 'shimmer 1.5s infinite',
      },
      keyframes: {
        fadeIn: { from: { opacity: '0' }, to: { opacity: '1' } },
        slideUp: { from: { opacity: '0', transform: 'translateY(8px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      backgroundImage: {
        'checker': `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16'%3E%3Crect width='8' height='8' fill='%23252532'/%3E%3Crect x='8' width='8' height='8' fill='%231A1A24'/%3E%3Crect y='8' width='8' height='8' fill='%231A1A24'/%3E%3Crect x='8' y='8' width='8' height='8' fill='%23252532'/%3E%3C/svg%3E")`,
      },
    },
  },
  plugins: [],
};

export default config;
