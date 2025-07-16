import tailwindcssAnimate from "tailwindcss-animate";

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // Include all your components/pages
  ],
  theme: {
    extend: {},
  },
  plugins: [
    tailwindcssAnimate, // if used in shadcn/ui
  ],
};
