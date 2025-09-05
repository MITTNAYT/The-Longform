/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class', '[data-theme="dark"]'],
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: 'var(--color-border)', /* primary-10-opacity */
        input: 'var(--color-input)', /* subtle-warm-gray */
        ring: 'var(--color-ring)', /* muted-gold */
        background: 'var(--color-background)', /* near-white */
        foreground: 'var(--color-foreground)', /* rich-dark-brown */
        primary: {
          DEFAULT: 'var(--color-primary)', /* deep-espresso-brown */
          foreground: 'var(--color-primary-foreground)', /* near-white */
        },
        secondary: {
          DEFAULT: 'var(--color-secondary)', /* soft-beige */
          foreground: 'var(--color-secondary-foreground)', /* rich-dark-brown */
        },
        destructive: {
          DEFAULT: 'var(--color-destructive)', /* sienna-brown */
          foreground: 'var(--color-destructive-foreground)', /* near-white */
        },
        muted: {
          DEFAULT: 'var(--color-muted)', /* soft-beige */
          foreground: 'var(--color-muted-foreground)', /* muted-brown */
        },
        accent: {
          DEFAULT: 'var(--color-accent)', /* muted-gold */
          foreground: 'var(--color-accent-foreground)', /* rich-dark-brown */
        },
        popover: {
          DEFAULT: 'var(--color-popover)', /* near-white */
          foreground: 'var(--color-popover-foreground)', /* rich-dark-brown */
        },
        card: {
          DEFAULT: 'var(--color-card)', /* subtle-warm-gray */
          foreground: 'var(--color-card-foreground)', /* rich-dark-brown */
        },
        success: {
          DEFAULT: 'var(--color-success)', /* sage-green */
          foreground: 'var(--color-success-foreground)', /* near-white */
        },
        warning: {
          DEFAULT: 'var(--color-warning)', /* dark-goldenrod */
          foreground: 'var(--color-warning-foreground)', /* near-white */
        },
        error: {
          DEFAULT: 'var(--color-error)', /* sienna-brown */
          foreground: 'var(--color-error-foreground)', /* near-white */
        },
        surface: 'var(--color-surface)', /* subtle-warm-gray */
        'text-primary': 'var(--color-text-primary)', /* rich-dark-brown */
        'text-secondary': 'var(--color-text-secondary)', /* muted-brown */
      },
      fontFamily: {
        'heading': ['Playfair Display', 'serif'],
        'body': ['Lato', 'sans-serif'],
        'caption': ['Source Sans Pro', 'sans-serif'],
        'mono': ['JetBrains Mono', 'monospace'],
        'sans': ['Lato', 'sans-serif'],
        'serif': ['Playfair Display', 'serif'],
      },
      fontSize: {
        'fluid-sm': 'clamp(0.875rem, 2vw, 1rem)',
        'fluid-base': 'clamp(1rem, 2.5vw, 1.125rem)',
        'fluid-lg': 'clamp(1.125rem, 3vw, 1.25rem)',
        'fluid-xl': 'clamp(1.25rem, 3.5vw, 1.5rem)',
        'fluid-2xl': 'clamp(1.5rem, 4vw, 2rem)',
        'fluid-3xl': 'clamp(1.875rem, 5vw, 2.5rem)',
      },
      lineHeight: {
        'reading': '1.8',
        'comfortable': '1.7',
        'tight': '1.3',
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },
      maxWidth: {
        'reading': '65ch',
        'prose': '75ch',
      },
      boxShadow: {
        'soft': '0 4px 20px rgba(75, 46, 46, 0.08)',
        'gentle': '0 2px 8px rgba(75, 46, 46, 0.06)',
        'warm': '0 8px 32px rgba(75, 46, 46, 0.12)',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        'slide-up': 'slideUp 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        'slide-down': 'slideDown 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      backdropBlur: {
        'xs': '2px',
      },
      transitionTimingFunction: {
        'gentle': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('tailwindcss-animate'),
  ],
}