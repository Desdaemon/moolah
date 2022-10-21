/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx, mdx, md}',
    './components/**/*.{js,ts,jsx,tsx, mdx, md}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#00a86b',
        secondary: '#D0410D', // complementary of primary
        surface: '#d9d9d9',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}
