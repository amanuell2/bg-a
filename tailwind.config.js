const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  purge: [],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Circe", "Inter", ...defaultTheme.fontFamily.sans],
        amharic: [
          "Noto Sans Ethiopic",
          "Circe",
          "Inter",
          ...defaultTheme.fontFamily.sans,
        ],
      },
      maxHeight: {
        "64": "16rem",
      },
      colors: {
        shuufare: {
          50: "#FFFBF2",
          100: "#FFF6E6",
          200: "#FFE9BF",
          300: "#FFDB99",
          400: "#FFC04D",
          500: "#FFA500",
          600: "#E69500",
          700: "#996300",
          800: "#734A00",
          900: "#4D3200",
        },
        primary: {
          500: "#FFD700"
        }
      },
    },
  },
  variants: {
    borderWidth: ["first"],
  },
  plugins: [require("@tailwindcss/custom-forms")],
};
