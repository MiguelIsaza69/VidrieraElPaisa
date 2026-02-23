import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'paisa-black': '#000000',
        'paisa-silver': '#C0C0C0',
        'paisa-light-gray': '#F5F5F5',
      },
      fontFamily: {
        sans: ['var(--font-outfit)', 'sans-serif'],
      },
      animation: {
        'reveal-up': 'revealUp 0.8s ease-out forwards',
      },
      keyframes: {
        revealUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};
export default config;
