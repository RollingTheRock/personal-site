/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1A1A1A',
          dark: '#EEEEEE',
        },
        secondary: {
          DEFAULT: '#555555',
          dark: '#A0A0A0',
        },
        muted: {
          DEFAULT: '#888888',
          dark: '#666666',
        },
        bg: {
          DEFAULT: '#FFFFFF',
          secondary: '#FAFAFA',
          tertiary: '#F5F5F5',
          dark: {
            DEFAULT: '#0A0A0A',
            secondary: '#111111',
            tertiary: '#1A1A1A',
          },
        },
        border: {
          DEFAULT: '#E5E5E5',
          dark: '#2A2A2A',
        },
        /* 品牌色 - 首页复古拼贴风格 */
        brand: {
          purple: '#A855F7',
          cyan: '#06B6D4',
          orange: '#F97316',
        },
        /* 分类卡片颜色 */
        category: {
          blog: '#7C3AED',
          project: '#0891B2',
          video: '#EA580C',
        },
      },
      fontFamily: {
        serif: ['Playfair Display', 'Noto Serif SC', 'Georgia', 'serif'],
        sans: ['Inter', '-apple-system', 'PingFang SC', 'Microsoft YaHei', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1.5' }],
        'sm': ['0.875rem', { lineHeight: '1.6' }],
        'base': ['1.125rem', { lineHeight: '1.75' }],
        'lg': ['1.25rem', { lineHeight: '1.6' }],
        'xl': ['1.5rem', { lineHeight: '1.4' }],
        '2xl': ['2rem', { lineHeight: '1.3' }],
        '3xl': ['2.5rem', { lineHeight: '1.2' }],
        '4xl': ['3.5rem', { lineHeight: '1.1' }],
      },
      maxWidth: {
        'article': '680px',
        'medium': '900px',
        'wide': '1100px',
        'full': '1400px',
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
      },
      lineHeight: {
        'relaxed': '1.75',
        'loose': '1.9',
      },
      transitionDuration: {
        '250': '250ms',
        '350': '350ms',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};
