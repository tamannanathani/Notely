/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0fffe',
          100: '#dcfffe',
          200: '#b1fbf8',
          300: '#7df6f2',
          400: '#45eceb',
          500: '#1dd9d4',
          600: '#16918f',
          700: '#157774',
          800: '#165d5a',
          900: '#164c4a',
          950: '#0b2e2d',
        },
        success: '#10b981',
        warning: '#f59e0b',
        error: '#ef4444',
        gray: {
          50: '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
          800: '#1f2937',
          900: '#111827',
        },
      },
      spacing: {
        '4.5': '1.125rem',
        '5.5': '1.375rem',
      },
      borderRadius: {
        'lg': '0.75rem',
      },
      boxShadow: {
        'sm': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        'md': '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        'lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
        'xl': '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
      },
      fontFamily: {
        sans: ['system-ui', 'sans-serif'],
      },
      transitionDuration: {
        '250': '250ms',
      },
    },
  },
  important: true,
  plugins: [],
}
