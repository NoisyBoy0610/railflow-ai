/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        rail: {
          navy: '#0F2C59',
          navyDark: '#081730',
          navyLight: '#1A407A',
          amber: '#FF7A00',
          amberLight: '#FF9E40',
          amberDark: '#D96800',
          surface: '#F8F9FA',
          surfaceDark: '#0b132b',
          card: '#FFFFFF',
          border: '#E2E8F0',
          confirmed: '#16A34A',
          rac: '#D97706',
          waitlist: '#DC2626',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        shimmer: {
          from: { backgroundPosition: '0 0' },
          to: { backgroundPosition: '-200% 0' },
        }
      }
    },
  },
  plugins: [],
}
