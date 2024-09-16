/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: '1rem',
        sm: '12px',
        md: '1rem',
        lg: '45px',
        xl: '5rem',
        '2xl': '13rem'
      },
      margin: {
        sm: 'auto'
      }
    },
    extend: {
      fontFamily: {
        sans: ['Poppins', 'sans-serif']
      },
      gridTemplateColumns: {
        '70/30': '70% 28%'
      }
    }
  },
  variants: {
    extend: {}
  },
  plugins: []
}
