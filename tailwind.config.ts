import type { Config } from 'tailwindcss';

export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      screens: {
        xs: '420px',
        xxs: '350px',
      },
      fontSize: {
        'heading-xs': '1.5rem',
        'heading-sm': ['32px', '40px'],
        'heading-md': '2.5rem',
        'heading-lg': ['48px', '52px'],
        'heading-xl': '3.5rem',
        'body-xs': '14px',
        'body-sm': '16px',
        'body-md': '18px',
        'body-lg': '20px',
        'body-xl': '24px',
      },
      textColor: {
        sidebar: {
          base: 'var(--color-text-side)',
          active: 'var(--color-text-side-active)',
        },
        btn: {
          primary: 'var(--color-button-text)',
          ghost: 'var(--color-ghost-button-text)',
        },
        gradient: {
          primary: 'var(--color-gradient-primary)',
          secondary: 'var(--color-gradient-secondary)',
          light: 'var(--color-text-gradient)',
        },
      },
      gridTemplateColumns: {
        16: 'repeat(auto-fill, minmax(50px, 1fr))',
      },
      colors: {
        /* Semantic palette mapped to CSS variables for consistent theming */
        primary: {
          100: 'var(--primary-b-100)', // light background
          300: 'var(--primary-1-b-456-fp-300)', // light border
          500: 'var(--color-button-bg)', // brand / accent
          600: 'var(--primary-001-e-3-cp-600)', // dark bg
        },
        neutrals: {
          10: 'var(--neutrals-g-10)',
          50: 'var(--neutrals-g-50)',
          100: 'var(--neutrals2-g-50)',
          300: 'var(--neutrals-g-300)',
          400: 'var(--neutrals-g-400)',
          500: 'var(--neutrals-g-500)',
          600: 'var(--neutrals-g-600)',
          700: 'var(--neutrals-g-700)',
          800: 'var(--neutrals-g-800)',
        },
        success: {
          100: 'var(--success-g-100)',
          200: 'var(--success-g-200)',
        },
        error: {
          100: 'var(--error-r-100)',
          200: 'var(--error-r-200)',
        },
        sidebarItemIcon: 'var(--color-sidebar-icon)',
        sidebarItemIconActive: 'var(--color-sidebar-icon-active)',
        input: {
          'search-text': 'var(--color-input-text)',
          'search-placeholder': 'var(--color-input-placeholder)',
        },
        link: 'var(--color-link)',
        'link-active': 'var(--color-link-active)',
        active: 'var(--color-button-bg)',
        icon: 'var(--color-icon)',
        side: {
          base: 'var(--color-text-side)',
          active: 'var(--color-text-side-active)',
        },
        layout: {
          'side-border': 'var(--color-side-border)',
        },
        btn: {
          ghost: 'var(--color-ghost-button-border)',
        },
      },
      backgroundColor: {
        btn: {
          primary: 'var(--color-button-bg)',
          secondary: 'var(--color-button-bg-secondary)',
        },
        input: {
          search: 'var(--color-input-bg)',
          'search-active': 'var(--color-input-search-active)', // fixed var name
        },
        layout: {
          header: 'var(--color-header-bg)',
          side: 'var(--color-side-bg)',
          'side-mobile': 'var(--color-side-mobile-bg)',
          'side-active': 'var(--color-side-bg-active)',
          hover: 'var(--color-hover-bg)',
        },
      },
      backgroundImage: {
        'landing-dark': 'var(--color-landing-bg)',
        'landing-light': 'var(--color-landing-bg-light)',
        'gradient-primary': 'var(--color-gradient-primary)',
        'gradient-light': 'var(--color-gradient-light)',
        'text-gradient': 'var(--color-text-gradient)',
        gradient: 'var(--color-text-gradient)',
      },
      inset: {
        '29%': '25%',
      },
    },
  },
  plugins: [],
} satisfies Config;