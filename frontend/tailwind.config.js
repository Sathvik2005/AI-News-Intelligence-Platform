/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#0b1220",
        mist: "#e6edf8",
        signal: "#0ea5e9",
        accent: "#f97316"
      }
    }
  },
  plugins: [],
};
