const exts = ['js', 'ts', 'jsx', 'tsx', 'mdx', 'md'].join(',')

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    `./pages/**/*.{${exts}}`,
    `./app/**/*.{${exts}}`,
    `./components/**/*.{${exts}}`,
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
    require('@tailwindcss/typography'),
  ],
}
