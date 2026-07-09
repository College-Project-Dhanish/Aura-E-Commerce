/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#111827',
        secondary: '#F8F8F8',
        accent: '#D4AF37',
        text: '#1F2937',
        muted: '#6B7280',
        border: '#E5E7EB',
        background: '#FAFAFA',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
