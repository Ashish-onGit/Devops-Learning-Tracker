/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Outfit', 'Inter', 'sans-serif'],
      },
      colors: {
        // True AMOLED Dark Theme color overrides for standard Slate shades
        slate: {
          50: '#FAFAFA',   // Light Primary Background
          100: '#F4F4F5',  // Light Secondary Background
          200: '#E4E4E7',  // Light border
          300: '#D4D4D8',  // Light elevated borders
          400: '#A1A1AA',  // Dark Text Primary/Secondary (zinc-400)
          500: '#71717A',  // Dark Text Muted (zinc-500)
          600: '#1A1A1A',  // Dark Active State
          650: '#1A1A1A',  // Dark Active State backup
          700: '#151515',  // Dark Hover State
          800: '#202020',  // Dark Borders
          850: '#111111',  // Dark Elevated Cards
          900: '#0A0A0A',  // Dark Cards
          950: '#000000',  // Dark Primary Background (true pitch black)
        }
      }
    },
  },
  plugins: [],
}
