/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gbs: {
          bg: {
            primary: '#F9F9F9',
            secondary: '#FFFFFF',
            card: '#FFFFFF',
            input: '#FFFFFF',
            elevated: '#F3F4F6'
          },
          accent: {
            DEFAULT: '#B91C1C', // Darkened red (Tailwind Red 700)
            hover: '#991B1B', // Red 800
            light: 'rgba(185, 28, 28, 0.1)',
            border: 'rgba(185, 28, 28, 0.3)'
          },
          success: {
            DEFAULT: '#10B981',
            bg: 'rgba(16, 185, 129, 0.1)'
          },
          warning: {
            DEFAULT: '#F59E0B',
            bg: 'rgba(245, 158, 11, 0.1)'
          },
          error: {
            DEFAULT: '#B91C1C',
            bg: 'rgba(185, 28, 28, 0.1)'
          },
          info: {
            DEFAULT: '#3B82F6',
            bg: 'rgba(59, 130, 246, 0.1)'
          },
          text: {
            primary: '#000000', // All text forced to black
            secondary: '#000000',
            muted: '#4B5563', // Kept slightly gray so it's readable as secondary/muted, but very dark
            disabled: '#9CA3AF'
          },
          border: {
            DEFAULT: '#E5E7EB',
            light: '#F3F4F6'
          }
        }
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif']
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease',
        'slide-up': 'slideUp 0.4s ease backwards',
        'slide-in-right': 'slideInRight 0.4s ease',
        'spin-slow': 'spin 0.8s linear infinite',
      },
      keyframes: {
        fadeIn: {
          'from': { opacity: '0', transform: 'translateY(10px)' },
          'to': { opacity: '1', transform: 'translateY(0)' }
        },
        slideUp: {
          'from': { opacity: '0', transform: 'translateY(20px)' },
          'to': { opacity: '1', transform: 'translateY(0)' }
        },
        slideInRight: {
          'from': { opacity: '0', transform: 'translateX(20px)' },
          'to': { opacity: '1', transform: 'translateX(0)' }
        }
      }
    },
  },
  plugins: [],
}
