/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './apps/**/index.html',
    './apps/**/src/**/*.{js,ts,jsx,tsx}',
    './src/shared/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
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
    },
  },
  plugins: [
    // eslint-disable-next-line no-undef -- CommonJS require in config file
    require('@tailwindcss/container-queries'),
  ],
};
