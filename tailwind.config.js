/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'aviation-blue': '#1e40af',
        'aviation-sky': '#0ea5e9',
        'aviation-navy': '#1e3a8a',
      },
    },
  },
  plugins: [],
}

