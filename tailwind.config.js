/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{html,js,jsx,svg}"],
  darkMode: "selector",
  theme: {
    extend: {
      colors: {
        "dark-color": "#1c1c1c",
      },
    },
    screens: {
      xs: "437px",
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1536px",
    },
  },
  plugins: [],
};
