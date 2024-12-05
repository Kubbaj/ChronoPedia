/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '0.75' }
        },
        fadeOut: {
          '0%': { opacity: '0.75' },
          '100%': { opacity: '0' }
        }
      },
      animation: {
        fadeIn: 'fadeIn 400ms ease-in forwards',
        fadeOut: 'fadeOut 400ms ease-out forwards'
      }
    }
  },
  plugins: [],
}