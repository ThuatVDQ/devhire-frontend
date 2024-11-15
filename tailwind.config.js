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
  plugins: [
    function ({ addComponents, theme, addBase }) {
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
        },
        '.custom-select': {
          backgroundColor: '#F9FAFB',
          borderColor: '#D1D5DB',
          color: '#111827',
          fontSize: theme('fontSize.sm'),
          borderRadius: '0.5rem',
          padding: '0.625rem 2rem 0.625rem 0.625rem', // Adjust padding for better spacing
          width: '100%',
          display: 'block',
          borderWidth: '1px',
          borderStyle: 'solid',
          position: 'relative',
          '&::after': {
            content: '"▼"',
            position: 'absolute',
            top: '50%',
            right: '0.625rem',
            transform: 'translateY(-50%)',
            color: '#111827',
            pointerEvents: 'none'
          },
          '&:focus': {
            outline: 'none',
            borderColor: '#3B82F6',
            boxShadow: `0 0 0 1px #3B82F6`
          },
          '@media (prefers-color-scheme: dark)': {
            backgroundColor: '#374151',
            borderColor: '#4B5563',
            color: '#F9FAFB',
            '&::after': {
              color: '#F9FAFB'
            }
          }
        }
      })
      addBase({
        'input[type="password"]::-ms-reveal': {
          display: 'none'
        },
        'input[type="password"]::-ms-clear': {
          display: 'none'
        },
        'input[type="password"]::-webkit-clear-button': {
          display: 'none'
        },
        'input[type="password"]::-webkit-inner-spin-button': {
          display: 'none'
        },
        'input[type="password"]::-webkit-outer-spin-button': {
          display: 'none'
        },
        'input[type="password"]::-webkit-textfield-decoration-container': {
          display: 'none'
        }
      })
    }
  ]
}
