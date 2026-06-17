import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f0f4ff',
          100: '#dde6ff',
          200: '#c3d1ff',
          300: '#9ab1ff',
          400: '#7086ff',
          500: '#4a5cf7',
          600: '#3a3eeb',
          700: '#2f2ed0',
          800: '#2929a8',
          900: '#272885',
          950: '#181853',
        },
      },
    },
  },
  plugins: [],
}
export default config
