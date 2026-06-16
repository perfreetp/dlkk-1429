/** @type {import('tailwindcss').Config} */

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      center: true,
    },
    extend: {
      colors: {
        primary: {
          50: "#E6EDFF",
          100: "#C2D1FF",
          200: "#9AB0FF",
          300: "#6A88E6",
          400: "#3D5FC0",
          500: "#0A2463",
          600: "#081E52",
          700: "#061740",
          800: "#04102E",
          900: "#02081A",
        },
        success: {
          50: "#E8F8F5",
          100: "#C1E9DE",
          200: "#96D8C6",
          300: "#68C7AD",
          400: "#43B99C",
          500: "#2A9D8F",
          600: "#228275",
          700: "#1B685D",
          800: "#144E46",
          900: "#0D342F",
        },
        warning: {
          50: "#FEF3E9",
          100: "#FBDFC4",
          200: "#F8C89A",
          300: "#F5AF6E",
          400: "#F29A4A",
          500: "#F4A261",
          600: "#D98648",
          700: "#B36A38",
          800: "#8D5028",
          900: "#67381A",
        },
        danger: {
          50: "#FDECEE",
          100: "#FBCED3",
          200: "#F79DA6",
          300: "#F06B7A",
          400: "#EA4257",
          500: "#E63946",
          600: "#C12D38",
          700: "#9A222C",
          800: "#731720",
          900: "#4D0E14",
        },
        dark: {
          50: "#F0F0F5",
          100: "#D1D1E0",
          200: "#A3A3C2",
          300: "#7575A3",
          400: "#474785",
          500: "#1A1A2E",
          600: "#151525",
          700: "#10101C",
          800: "#0B0B14",
          900: "#06060A",
        },
        glass: {
          light: "rgba(255, 255, 255, 0.08)",
          DEFAULT: "rgba(255, 255, 255, 0.05)",
          dark: "rgba(0, 0, 0, 0.2)",
        },
      },
      fontFamily: {
        sans: [
          '"Noto Sans SC"',
          "-apple-system",
          "BlinkMacSystemFont",
          '"Segoe UI"',
          "sans-serif",
        ],
        mono: [
          "JetBrains Mono",
          "Menlo",
          "Monaco",
          "Consolas",
          "monospace",
        ],
      },
      boxShadow: {
        "glow-primary": "0 0 20px rgba(10, 36, 99, 0.5)",
        "glow-success": "0 0 20px rgba(42, 157, 143, 0.5)",
        "glow-warning": "0 0 20px rgba(244, 162, 97, 0.5)",
        "glow-danger": "0 0 20px rgba(230, 57, 70, 0.5)",
        "card": "0 4px 20px rgba(0, 0, 0, 0.3)",
      },
      backgroundImage: {
        "gradient-primary":
          "linear-gradient(135deg, #0A2463 0%, #1a3a7a 50%, #0A2463 100%)",
        "gradient-dark":
          "linear-gradient(180deg, #1A1A2E 0%, #0f0f1a 100%)",
        "gradient-glass":
          "linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.02) 100%)",
      },
      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "bounce-slow": "bounce 2s infinite",
        "fade-in": "fadeIn 0.3s ease-in-out",
        "slide-up": "slideUp 0.3s ease-out",
        "slide-left": "slideLeft 0.3s ease-out",
        "glow": "glow 2s ease-in-out infinite alternate",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        slideLeft: {
          "0%": { transform: "translateX(-20px)", opacity: "0" },
          "100%": { transform: "translateX(0)", opacity: "1" },
        },
        glow: {
          "0%": { boxShadow: "0 0 5px rgba(42, 157, 143, 0.5)" },
          "100%": { boxShadow: "0 0 20px rgba(42, 157, 143, 0.8)" },
        },
      },
      transitionProperty: {
        height: "height",
        spacing: "margin, padding",
      },
    },
  },
  plugins: [],
};
