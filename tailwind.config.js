/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Poppins', 'sans-serif']
      },
      gridTemplateColumns: {
        '70/30': '70% 28%'
      }
    }
  },
  plugins: [
    function ({ addComponents, theme }) {
      addComponents({
        '.form-input': {
          backgroundColor: '#F9FAFB',
          borderColor: '#D1D5DB',
          color: '#111827',
          fontSize: theme('fontSize.sm'),
          borderRadius: '0.5rem',
          padding: '0.625rem',
          width: '100%',
          display: 'block',
          borderWidth: '1px',
          borderStyle: 'solid',
          '&:focus': {
            outline: 'none',
            borderColor: '#3B82F6',
            boxShadow: `0 0 0 1px #3B82F6`
          }
        }
      })
    }
  ]
}
