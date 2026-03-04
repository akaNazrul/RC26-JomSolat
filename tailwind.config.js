/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Dark Mode Colors
        'bg-base': 'var(--bg-base)',
        'bg-surface': 'var(--bg-surface)',
        'bg-elevated': 'var(--bg-elevated)',
        'accent-primary': 'var(--accent-primary)',
        'accent-warm': 'var(--accent-warm)',
        'text-primary': 'var(--text-primary)',
        'text-secondary': 'var(--text-secondary)',
        'text-muted': 'var(--text-muted)',
        'border-color': 'var(--border-color)',
        'prayer-active': 'var(--prayer-active)',
        'prayer-passed': 'var(--prayer-passed)',
        'prayer-upcoming': 'var(--prayer-upcoming)',
      },
      fontFamily: {
        display: ['Amiri', 'serif'],
        body: ['Poppins', 'sans-serif'],
        arabic: ['Noto Naskh Arabic', 'serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
      },
      borderRadius: {
        'xl': '12px',
        '2xl': '16px',
        '3xl': '20px',
      },
      animation: {
        'bounce-gentle': 'bounce-gentle 800ms ease-in-out infinite',
        'shimmer': 'shimmer 1500ms linear infinite',
        'fade-in': 'fade-in 300ms ease-out',
        'slide-up': 'slide-up 320ms ease-out',
        'donut': 'donut 1000ms linear',
      },
      keyframes: {
        'bounce-gentle': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(8px)' },
        },
        'shimmer': {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'slide-up': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'donut': {
          '0%': { strokeDashoffset: '0' },
          '100%': { strokeDashoffset: '339.3' },
        },
      },
    },
  },
  plugins: [],
}

