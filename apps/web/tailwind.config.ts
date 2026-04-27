import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#7c3aed',
          dark:    '#6d28d9',
          soft:    '#f3efff',
          '100':   '#ede9fe',
          '200':   '#ddd6fe',
        },
        accent: '#ec4899',
        ink: {
          DEFAULT: '#0d0d14',
          '2': '#3d3a50',
          '3': '#7b778f',
          '4': '#b0acc4',
        },
        surface: {
          DEFAULT: '#ffffff',
          '2': '#f7f6fb',
          '3': '#efedf8',
        },
        border: {
          DEFAULT: '#e6e3f0',
          strong:  '#ccc9db',
        },
        intent: {
          indigo: '#4F46E5',
          pink: '#F43F5E',
          violet: '#8B5CF6',
          pearl: '#F8FAFC',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        'sm':  '8px',
        'md':  '12px',
        'lg':  '18px',
        'xl':  '24px',
        '2xl': '32px',
      },
      boxShadow: {
        card:       '0 1px 3px rgba(80,60,140,0.07), 0 1px 2px rgba(80,60,140,0.04)',
        'card-hover':'0 4px 16px rgba(80,60,140,0.10), 0 2px 4px rgba(80,60,140,0.06)',
        panel:      '0 12px 40px rgba(80,60,140,0.14), 0 4px 8px rgba(80,60,140,0.06)',
        inner:      'inset 0 1px 3px rgba(80,60,140,0.08)',
      },
      backgroundImage: {
        'gradient-hero':   'linear-gradient(135deg, #7c3aed 0%, #ec4899 100%)',
        'gradient-subtle': 'linear-gradient(135deg, #f3efff 0%, #fce7f3 100%)',
        'brand-gradient': 'linear-gradient(to right, #4F46E5, #8B5CF6, #F43F5E)',
      },
      keyframes: {
        fadeUp: {
          '0%':   { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        scaleIn: {
          '0%':   { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
      animation: {
        'fade-up':  'fadeUp 0.4s cubic-bezier(0.4,0,0.2,1) both',
        'fade-in':  'fadeIn 0.3s cubic-bezier(0.4,0,0.2,1) both',
        'scale-in': 'scaleIn 0.25s cubic-bezier(0.4,0,0.2,1) both',
      },
    },
  },
  plugins: [],
};

export default config;
