/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        surface: '#faf9fd',
        'surface-base': '#FFFFFF',
        'surface-subtle': '#F8F9FA',
        'surface-muted': '#F3F4F6',
        'glow-cyan': '#A5F3FC',
        'glow-lavender': '#DDD6FE',
        'glow-mint': '#A7F3D0',
        'glow-yellow': '#FEF08A',
        'glow-coral': '#FECDD3',
        'border-subtle': '#E5E7EB',
        'border-strong': '#D1D5DB',
        'text-primary': '#202124',
        'text-secondary': '#6B7280',
        'text-tertiary': '#9CA3AF',
        primary: '#000000',
        'on-primary': '#ffffff',
      },
      fontFamily: {
        body: ['Inter', 'sans-serif'],
        code: ['JetBrains Mono', 'monospace'],
      },
      spacing: {
        'margin-mobile': '1.25rem',
        margin: '3rem',
        'space-md': '1rem',
      },
    },
  },
  plugins: [],
};
