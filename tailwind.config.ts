// Function to generate safelist for all color utilities
function generateColorSafelist() {
  const colors = {
    priority: ['highest', 'high', 'medium', 'low'],
    primary: ['100', '200', '300', '500', '600'],
    neutrals: ['10', '50', '100', '300', '400', '500', '600', '700', '800'],
    success: ['100', '200'],
    error: ['100', '200'],
  }

  const utilities = ['bg', 'text', 'border']
  const variants = ['', 'hover:', 'focus:', 'active:', 'disabled:']

  const safelist: Array<string> = []

  // Generate all color combinations
  Object.entries(colors).forEach(([colorName, colorValues]) => {
    colorValues.forEach((value) => {
      const colorKey = `${colorName}-${value}`

      utilities.forEach((utility) => {
        variants.forEach((variant) => {
          safelist.push(`${variant}${utility}-${colorKey}`)
        })
      })
    })
  })

  // Add additional utility variants
  const additionalUtilities = [
    'ring',
    'shadow',
    'outline',
    'decoration',
    'accent',
    'caret',
    'fill',
    'stroke',
  ]
  Object.entries(colors).forEach(([colorName, colorValues]) => {
    colorValues.forEach((value) => {
      const colorKey = `${colorName}-${value}`

      additionalUtilities.forEach((utility) => {
        safelist.push(`${utility}-${colorKey}`)
        safelist.push(`hover:${utility}-${colorKey}`)
        safelist.push(`focus:${utility}-${colorKey}`)
      })
    })
  })

  return safelist
}

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  safelist: generateColorSafelist(),
  darkMode: 'class', // Enable class-based dark mode
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
      backgroundColor: {
        /* Direct color values with light/dark mode support */
        primary: {
          100: '#f0f9ff', // light blue
          200: '#0254A5', // light blue
          300: '#7dd3fc', // sky blue
          500: '#3b82f6', // blue
          600: '#1d4ed8', // dark blue
        },
        neutrals: {
          10: '#f8fafc', // slate-50
          50: '#f1f5f9', // slate-100
          100: '#e2e8f0', // slate-200
          300: '#cbd5e1', // slate-300
          400: '#94a3b8', // slate-400
          500: '#64748b', // slate-500
          600: '#475569', // slate-600
          700: '#334155', // slate-700
          800: '#1e293b', // slate-800
        },
        success: {
          100: '#dcfce7', // green-100
          200: '#bbf7d0', // green-200
        },
        error: {
          100: '#fee2e2', // red-100
          200: '#fecaca', // red-200
        },
        sidebarItemIcon: '#64748b', // slate-500
        sidebarItemIconActive: '#3b82f6', // blue-500
        btn: {
          primary: '#3b82f6', // blue-500
          secondary: '#64748b', // slate-500
        },
        input: {
          search: '#f8fafc', // slate-50
          'search-active': '#e2e8f0', // slate-200
        },
        layout: {
          header: '#ffffff', // white
          side: '#f8fafc', // slate-50
          'side-mobile': '#f1f5f9', // slate-100
          'side-active': '#e2e8f0', // slate-200
          hover: '#f1f5f9', // slate-100
        },
        link: '#3b82f6', // blue-500
        'link-active': '#1d4ed8', // blue-600
        active: '#3b82f6', // blue-500
        icon: '#64748b', // slate-500
        side: {
          base: '#475569', // slate-600
          active: '#1e293b', // slate-800
        },
        // Dark mode variants
        'dark-primary': {
          100: '#1e3a8a', // blue-800
          200: '#1e40af', // blue-700
          300: '#1d4ed8', // blue-600
          500: '#60a5fa', // blue-400
          600: '#93c5fd', // blue-300
        },
        'dark-neutrals': {
          10: '#0f172a', // slate-900
          50: '#1e293b', // slate-800
          100: '#334155', // slate-700
          300: '#475569', // slate-600
          400: '#64748b', // slate-500
          500: '#94a3b8', // slate-400
          600: '#cbd5e1', // slate-300
          700: '#e2e8f0', // slate-200
          800: '#f1f5f9', // slate-100
        },
        'dark-success': {
          100: '#166534', // green-800
          200: '#16a34a', // green-600
        },
        'dark-error': {
          100: '#991b1b', // red-800
          200: '#dc2626', // red-600
        },
        'dark-sidebarItemIcon': '#94a3b8', // slate-400
        'dark-sidebarItemIconActive': '#60a5fa', // blue-400
        'dark-btn': {
          primary: '#60a5fa', // blue-400
          secondary: '#94a3b8', // slate-400
        },
        'dark-input': {
          search: '#1e293b', // slate-800
          'search-active': '#334155', // slate-700
        },
        'dark-layout': {
          header: '#0f172a', // slate-900
          side: '#1e293b', // slate-800
          'side-mobile': '#334155', // slate-700
          'side-active': '#475569', // slate-600
          hover: '#334155', // slate-700
        },
        'dark-link': '#60a5fa', // blue-400
        'dark-link-active': '#93c5fd', // blue-300
        'dark-active': '#60a5fa', // blue-400
        'dark-icon': '#94a3b8', // slate-400
        'dark-side': {
          base: '#cbd5e1', // slate-300
          active: '#f1f5f9', // slate-100
        },
      },
      textColor: {
        sidebar: {
          base: '#475569', // slate-600
          active: '#1e293b', // slate-800
        },
        btn: {
          primary: '#ffffff', // white
          ghost: '#64748b', // slate-500
        },
        gradient: {
          primary: '#3b82f6', // blue-500
          secondary: '#1d4ed8', // blue-600
          light: '#f0f9ff', // blue-50
        },
        // Dark mode variants
        'dark-sidebar': {
          base: '#cbd5e1', // slate-300
          active: '#f1f5f9', // slate-100
        },
        'dark-btn': {
          primary: '#0f172a', // slate-900
          ghost: '#94a3b8', // slate-400
        },
        'dark-gradient': {
          primary: '#60a5fa', // blue-400
          secondary: '#93c5fd', // blue-300
          light: '#1e3a8a', // blue-800
        },
      },
      gridTemplateColumns: {
        16: 'repeat(auto-fill, minmax(50px, 1fr))',
      },
      backgroundImage: {
        'landing-dark': '#0f172a', // slate-900
        'landing-light': '#f8fafc', // slate-50
        'gradient-primary': 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
        'gradient-light': 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
        'text-gradient': 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
        gradient: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
        // Dark mode variants
        'dark-gradient-primary': 'linear-gradient(135deg, #60a5fa 0%, #93c5fd 100%)',
        'dark-gradient-light': 'linear-gradient(135deg, #1e3a8a 0%, #1d4ed8 100%)',
        'dark-text-gradient': 'linear-gradient(135deg, #60a5fa 0%, #93c5fd 100%)',
        'dark-gradient': 'linear-gradient(135deg, #60a5fa 0%, #93c5fd 100%)',
      },
      inset: {
        '29%': '25%',
      },
    },
  },
  plugins: [],
}
