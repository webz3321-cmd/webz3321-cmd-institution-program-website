/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        skyfest: '#2b6cff',
        deepblue: '#1d4ed8',
        limefest: '#a3e635',
        orangefest: '#e64e24',
        amberfest: '#f5a623',
      },
      fontFamily: {
        hand: ['"Caveat"', 'cursive'],
        serif: ['Georgia', "'Times New Roman'", 'serif'],
        sans: ['system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
