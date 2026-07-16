/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // « Le terrain, en poche »
        'grass-deep': '#07281C',
        grass: '#0F5136',
        'grass-light': '#1B7A4F',
        chalk: '#F4F7F0',
        floodlight: '#FFC542',
        card: '#E0492F',
      },
      fontFamily: {
        display: ['Anton', 'sans-serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      borderRadius: {
        pitch: '16px',
      },
      boxShadow: {
        soft: '0 8px 24px -8px rgba(0,0,0,0.45)',
        lift: '0 12px 32px -10px rgba(0,0,0,0.55)',
      },
      keyframes: {
        drawLine: { from: { strokeDashoffset: '1000' }, to: { strokeDashoffset: '0' } },
        pop: { '0%': { transform: 'scale(0)', opacity: '0' }, '70%': { transform: 'scale(1.12)' }, '100%': { transform: 'scale(1)', opacity: '1' } },
        pulseSlot: { '0%,100%': { opacity: '1', transform: 'scale(1)' }, '50%': { opacity: '0.55', transform: 'scale(0.92)' } },
        flap: { from: { transform: 'translateY(-60%)', opacity: '0' }, to: { transform: 'translateY(0)', opacity: '1' } },
        slideUp: { from: { transform: 'translateY(100%)' }, to: { transform: 'translateY(0)' } },
        fadeIn: { from: { opacity: '0' }, to: { opacity: '1' } },
        toastIn: { from: { opacity: '0', transform: 'transl(-50%,-12px)' }, to: { opacity: '1', transform: 'translate(-50%,0)' } },
      },
      animation: {
        pop: 'pop 0.35s cubic-bezier(0.34,1.56,0.64,1) both',
        'pulse-slot': 'pulseSlot 1.8s ease-in-out infinite',
        flap: 'flap 0.4s ease both',
        'slide-up': 'slideUp 0.3s cubic-bezier(0.16,1,0.3,1) both',
        'fade-in': 'fadeIn 0.25s ease both',
      },
    },
  },
  plugins: [],
}
