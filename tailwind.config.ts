import type { Config } from 'tailwindcss';

// Function to generate safelist for all color utilities
function generateColorSafelist() {
  const colors = {
    priority: ['highest', 'high', 'medium', 'low'],
    primary: ['100', '300', '500', '600'],
    neutrals: ['10', '50', '100', '300', '400', '500', '600', '700', '800'],
    success: ['100', '200'],
    error: ['100', '200'],
  };

  const utilities = ['bg', 'text', 'border'];
  const variants = ['', 'hover:', 'focus:', 'active:', 'disabled:'];
  
  const safelist: string[] = [];
  
  // Generate all color combinations
  Object.entries(colors).forEach(([colorName, colorValues]) => {
    colorValues.forEach(value => {
      const colorKey = `${colorName}-${value}`;
      
      utilities.forEach(utility => {
        variants.forEach(variant => {
          safelist.push(`${variant}${utility}-${colorKey}`);
        });
      });
    });
  });
  
  // Add additional utility variants
  const additionalUtilities = ['ring', 'shadow', 'outline', 'decoration', 'accent', 'caret', 'fill', 'stroke'];
  Object.entries(colors).forEach(([colorName, colorValues]) => {
    colorValues.forEach(value => {
      const colorKey = `${colorName}-${value}`;
      
      additionalUtilities.forEach(utility => {
        safelist.push(`${utility}-${colorKey}`);
        safelist.push(`hover:${utility}-${colorKey}`);
        safelist.push(`focus:${utility}-${colorKey}`);
      });
    });
  });
  
  return safelist;
}

export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  safelist: generateColorSafelist(),
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
      colors: {
        priority: {
          highest: '#994141',
          high: '#7C5228',
          medium: '#B6A11C',
          low: '#3B6934',
        },
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
      backgroundColor: {
        btn: {
          primary: 'var(--color-button-bg)',
          secondary: 'var(--color-button-bg-secondary)',
        },
        input: {
          search: 'var(--color-input-bg)',
          'search-active': 'var(--color-input-search-active)',
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
}
