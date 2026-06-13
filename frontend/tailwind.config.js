/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // Base layout
        bg: "#ffffff",
        "bg-soft": "#f9fafb",
        text: "#6b6375",
        "text-h": "#08060d",
        border: "#e5e4e7",

        // KajuMart brand — Dark Forest Green
        brand: {
          50: "#eaf1ec",
          100: "#d2e3d8",
          200: "#a6c8b3",
          300: "#79ac8d",
          400: "#4c8f68",
          500: "#2f6b4f",
          600: "#1f3a2e", // primary
          700: "#172c23",
          800: "#0f1f19",
          900: "#0a1611",
        },

        // Roasted-cashew amber — auction urgency / countdowns
        amber: {
          50: "#fdf3ea",
          100: "#f9e1c8",
          200: "#f0c191",
          300: "#e6a05a",
          400: "#dc8330",
          500: "#c46a1c",
          600: "#9c5316",
        },

        // Status
        danger: {
          50: "#fdecec",
          500: "#c2410c",
          600: "#a93709",
        },
        success: {
          50: "#eaf1ec",
          100: "#d2e3d8",
          200: "#bcdac8",
          500: "#2f6b4f",
          600: "#27593f",
          700: "#1f4732",
        },
      },
      fontFamily: {
        display: ["Manrope", "sans-serif"],
        sans: ["Inter", "sans-serif"],
        mono: ["IBM Plex Mono", "ui-monospace", "monospace"],
      },
      borderRadius: {
        card: "10px",
      },
      boxShadow: {
        card: "0 1px 2px 0 rgba(8, 6, 13, 0.04)",
        pop: "0 8px 24px -8px rgba(31, 58, 46, 0.25)",
      },
    },
  },
  plugins: [],
};
