import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",        // app directory
    "./pages/**/*.{js,ts,jsx,tsx}",      // pages directory
    "./components/**/*.{js,ts,jsx,tsx}", // componentes
    "./src/**/*.{js,ts,jsx,tsx}",        // se você usa pasta src
  ],
  theme: {
    extend: {
      colors: {
        "highlight-green": "#00FF88",
      },
      keyframes: {
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-up-fade': {
          '0%': { opacity: '0', transform: 'translateY(40px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'bounce-in': {
          '0%': { opacity: '0', transform: 'scale(0.9)' },
          '60%': { opacity: '1', transform: 'scale(1.05)' },
          '100%': { transform: 'scale(1)' },
        },
        'zoom-fade-in': {
          '0%': { opacity: '0', transform: 'scale(0.9)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
      animation: {
        'fade-in-up': 'fade-in-up 0.7s ease-out forwards',
        'slide-up-fade': 'slide-up-fade 0.7s ease-out forwards',
        'bounce-in': 'bounce-in 1.2s ease-out forwards', // ⏳ mais lento
        'zoom-fade-in': 'zoom-fade-in 0.8s ease-out forwards', // novo do meio
      },
    },
  },
  plugins: [],
};

export default config;
