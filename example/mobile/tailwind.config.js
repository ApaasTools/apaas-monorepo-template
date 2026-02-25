/** @type {import('tailwindcss').Config} */
module.exports = {
  mode: 'jit',
  prefix: 'tw-',
  content: ['./public/index.html', './src/**/*.{vue,js,ts}'],
  corePlugins: {
    container: false,
    preflight: false
  },
  theme: { extend: {} },
  plugins: []
}
