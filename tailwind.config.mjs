/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        primary: '#00D4FF',
        'primary-dark': '#0099BB',
        secondary: '#7B2FFF',
        accent: '#FF2D78',
        accent2: '#00FFB3',
        'bg-dark': '#030810',
        'bg-card': '#070F1E',
        'bg-card2': '#0A1628',
        border: 'rgba(0, 212, 255, 0.15)',
        'border-bright': 'rgba(0, 212, 255, 0.4)',
        'text-base': '#E8F4FF',
        'text-muted': '#6B8FAF',
        'text-dim': '#3A5A7A',
      },
      fontFamily: {
        display: ['Orbitron', 'monospace'],
        body: ['Syne', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      animation: {
        'pulse-slow': 'pulse 2s infinite',
        float: 'float 5s ease-in-out infinite',
        'float-slow': 'float 8s ease-in-out infinite',
        marquee: 'marquee 22s linear infinite',
        'glow-rotate': 'glow-rotate 10s linear infinite',
        'glow-rotate-rev': 'glow-rotate 7s linear infinite reverse',
        'glow-rotate-fast': 'glow-rotate 5s linear infinite',
        't-bounce': 'tBounce 1.4s infinite',
        ripple: 'ripple 2s ease-out infinite',
        scanline: 'scanline 3s linear infinite',
        'sync-anim': 'syncAnim 2s ease-in-out infinite',
        blink: 'blink 1s infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-15px)' },
        },
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        'glow-rotate': {
          from: { transform: 'rotate(0deg)' },
          to: { transform: 'rotate(360deg)' },
        },
        tBounce: {
          '0%, 80%, 100%': { transform: 'translateY(0)' },
          '40%': { transform: 'translateY(-5px)' },
        },
        ripple: {
          '0%': { transform: 'scale(0.8)', opacity: '1' },
          '100%': { transform: 'scale(2)', opacity: '0' },
        },
        syncAnim: {
          '0%': { width: '15%' },
          '50%': { width: '75%' },
          '100%': { width: '15%' },
        },
        blink: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        },
      },
      boxShadow: {
        'glow-primary': '0 0 30px rgba(0, 212, 255, 0.4)',
        'glow-secondary': '0 0 30px rgba(123, 47, 255, 0.4)',
        'glow-accent': '0 0 30px rgba(255, 45, 120, 0.4)',
      },
      backgroundImage: {
        grid: "linear-gradient(rgba(0,212,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,212,255,0.03) 1px, transparent 1px)",
      },
      backgroundSize: {
        grid: '60px 60px',
      },
    },
  },
  plugins: [],
};
