/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './apps/**/index.html',
    './apps/**/src/**/*.{js,ts,jsx,tsx}',
    './src/shared/**/*.{js,ts,jsx,tsx}',
  ],
  safelist: [
    // Primary colors
    'bg-primary',
    'bg-primary-hover',
    'bg-primary-light',
    'bg-primary-dark',
    'bg-primary/10',
    'bg-primary/20',
    'bg-primary/30',
    'hover:bg-primary-hover',
    'text-primary',
    'text-primary-light',
    'hover:text-primary-light',
    'border-primary/30',
    // Theme text colors
    'text-theme-text',
    'text-theme-text-muted',
    'text-theme-text-dim',
    'text-theme-text-dark',
    'text-theme-text-dark-muted',
    'text-theme-text-dark-dim',
    'text-theme-text-light',
    'text-theme-text-light-muted',
    'text-theme-text-light-dim',
    'bg-theme-background',
    'bg-theme-background/40',
    'bg-theme-background/90',
    // Surfaces
    'bg-theme-surface',
    'bg-theme-surface-light',
    'bg-theme-surface-hover',
    'hover:bg-theme-surface-hover',
    'bg-theme-background/85',
    'backdrop-blur-sm',
    // Borders
    'border-theme-border',
    'border-theme-border-light',
    'border-theme-border-dark',
    'bg-theme-border-light',
  ],
  theme: {
    extend: {
      // Theme colors (CSS variables applied by ThemeProvider)
      colors: {
        primary: 'var(--color-primary)',
        'primary-hover': 'var(--color-primary-hover)',
        'primary-light': 'var(--color-primary-light)',
        'primary-dark': 'var(--color-primary-dark)',
        'theme-background': 'var(--color-background)',
        'theme-surface': 'var(--color-surface)',
        'theme-surface-light': 'var(--color-surface-light)',
        'theme-surface-hover': 'var(--color-surface-hover)',
        'theme-text': 'var(--color-text)',
        'theme-text-muted': 'var(--color-text-muted)',
        'theme-text-dim': 'var(--color-text-dim)',
        'theme-text-dark': 'var(--color-text-dark)',
        'theme-text-dark-muted': 'var(--color-text-dark-muted)',
        'theme-text-dark-dim': 'var(--color-text-dark-dim)',
        'theme-text-light': 'var(--color-text-light)',
        'theme-text-light-muted': 'var(--color-text-light-muted)',
        'theme-text-light-dim': 'var(--color-text-light-dim)',
        'theme-border': 'var(--color-border)',
        'theme-border-light': 'var(--color-border-light)',
        'theme-border-dark': 'var(--color-border-dark)',
      },
      // Standard responsive breakpoints (Tailwind-native screens)
      screens: {
        'xs': '390px',
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1536px',
      },
      // Container queries for component-level responsiveness
      containers: {
        'xs': '390px',
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
      },
      // Animations
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '200% center' },
          '100%': { backgroundPosition: '-200% center' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        'float-delayed': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-15px)' },
        },
        'icon-float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-3px)' },
        },
        'pulse-slow': {
          '0%, 100%': { opacity: '0.4' },
          '50%': { opacity: '1' },
        },
        'scale-in': {
          '0%': { transform: 'scale(0)' },
          '100%': { transform: 'scale(1)' },
        },
        sweep: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        'slide-up': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        sparkle: {
          '0%, 100%': { opacity: '0', transform: 'scale(0) rotate(0deg)' },
          '50%': { opacity: '1', transform: 'scale(1) rotate(180deg)' },
        },
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 20px rgba(59, 130, 246, 0.5)' },
          '50%': { boxShadow: '0 0 40px rgba(59, 130, 246, 0.8)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        twinkle: {
          '0%, 100%': { opacity: '0.2', transform: 'scale(1)' },
          '50%': { opacity: '1', transform: 'scale(1.5)' },
        },
        'spin-slow': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
      },
      animation: {
        shimmer: 'shimmer 3s linear infinite',
        float: 'float 6s ease-in-out infinite',
        'float-delayed': 'float-delayed 8s ease-in-out infinite 1s',
        'icon-float': 'icon-float 2s ease-in-out infinite',
        'pulse-slow': 'pulse-slow 3s ease-in-out infinite',
        'scale-in': 'scale-in 0.3s ease-out',
        sweep: 'sweep 2s ease-in-out',
        'slide-up': 'slide-up 0.6s ease-out',
        sparkle: 'sparkle 1s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'fade-in': 'fade-in 0.5s ease-out',
        twinkle: 'twinkle 3s ease-in-out infinite',
        'spin-slow': 'spin-slow 8s linear infinite',
      },
    },
  },
  plugins: [
    // eslint-disable-next-line no-undef -- CommonJS require in config file
    require('@tailwindcss/container-queries'),
    // Add scrollbar-hide utility
    // eslint-disable-next-line no-undef -- CommonJS require in config file
    function({ addUtilities }) {
      addUtilities({
        '.scrollbar-hide': {
          /* IE and Edge */
          '-ms-overflow-style': 'none',
          /* Firefox */
          'scrollbar-width': 'none',
          /* Safari and Chrome */
          '&::-webkit-scrollbar': {
            display: 'none'
          }
        }
      })
    }
  ],
};
