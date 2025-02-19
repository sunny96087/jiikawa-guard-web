/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './components/**/*.{vue,js,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './composables/**/*.{js,ts}',
    './plugins/**/*.{js,ts}',
    './utils/**/*.{js,ts}',
    './{App,app}.{js,ts,vue}',
    './{Error,error}.{js,ts,vue}',
    './app.config.{js,ts}'
  ],
  theme: {
    extend: {
      colors: {
        primary1: '#E1FAFC',
        primary2: '#C5F0ED',
        primary3: '#96D1E3',
        primary4: '#6BB8D6',
        primary5: '#449FC9',
        primary6: '#2181BC',
        secondary1: '#FFF5E6',
        secondary2: '#FFE9A6',
        secondary3: '#FFDE7D',
        secondary4: '#FFD754',
        secondary5: '#FFB82B',
        secondary6: '#FF9A03'
      }
    }
  },
  plugins: []
}
