/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1A5276',
          foreground: '#FFFFFF',
          light: '#2E86C1',
        },
        accent: {
          DEFAULT: '#17A589',
          foreground: '#FFFFFF',
          warm: '#E67E22',
        },
        background: '#F8FFFE',
        foreground: '#1C2833',
        muted: {
          DEFAULT: '#F0F3F4',
          foreground: '#566573',
        },
        border: '#D5DBDB',
        card: {
          DEFAULT: '#FFFFFF',
          foreground: '#1C2833',
        },
        // Legacy colors for backwards compatibility
        surface: '#F8FFFE',
        'surface-card': '#FFFFFF',
        'text-primary': '#1C2833',
        'text-secondary': '#566573',
        'text-muted': '#AAB7B8',
        success: '#27AE60',
        warning: '#E67E22',
        danger: '#E74C3C',
        destructive: {
          DEFAULT: '#E74C3C',
          foreground: '#FFFFFF',
        },
      },
      borderRadius: {
        lg: '0.75rem',
        md: '0.5rem',
        sm: '0.25rem',
      },
      fontFamily: {
        heading: ['Sora', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
        kannada: ['Noto Sans Kannada', 'sans-serif'],
      },
      boxShadow: {
        card: '0 4px 20px rgba(26, 82, 118, 0.10)',
        'card-hover': '0 8px 32px rgba(26, 82, 118, 0.18)',
      },
      borderRadius: {
        card: '12px',
        btn: '8px',
        input: '6px',
      },
    },
  },
  plugins: [],
}
