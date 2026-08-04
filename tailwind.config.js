/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#006FF5',
          50: '#F0F7FF',
          100: '#E1EFFF',
          200: '#B7D9FF',
          300: '#88BCF5',
          400: '#4D9FFF',
          500: '#006FF5',
          600: '#005FD6',
          700: '#0056C7',
          900: '#0D2847',
        },
        ink: {
          DEFAULT: '#0D2847',
          900: '#0A1F3C',
          700: '#0D2847',
          500: '#33507A',
          400: '#52708F',
          300: '#7E95B3',
          200: '#AFC2D9',
          100: '#DFE9F5',
          50: '#F4F7FB',
        },
        rec: '#EF4444',
        ok: '#10B981',
      },
      fontFamily: {
        sans: ['"Open Sans"', 'system-ui', 'sans-serif'],
        display: ['"Open Sans"', 'system-ui', 'sans-serif'],
        mono: ['"Space Grotesk"', 'ui-monospace', 'monospace'],
      },
      borderRadius: {
        pill: '999px',
      },
      boxShadow: {
        glow: '0 8px 30px rgba(0,111,245,0.35)',
        card: '0 1px 2px rgba(13,40,71,0.05), 0 8px 24px rgba(13,40,71,0.08)',
        'card-hover':
          '0 20px 25px -5px rgba(13,40,71,0.10), 0 8px 10px -6px rgba(13,40,71,0.10)',
      },
    },
  },
  plugins: [],
}
