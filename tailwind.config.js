/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          400: '#FCD34D',
          500: '#F59E0B',
          600: '#D97706',
        },
        charcoal: {
          800: '#1F2937',
          900: '#111827',
        },
      },
    },
  },
  plugins: [],
}
