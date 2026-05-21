/** @type {import('tailwindcss').Config} */
const plugin = require('tailwindcss/plugin')

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        space: ['"Space Grotesk"', 'sans-serif'],
        oswald: ['"Oswald"', 'sans-serif'],
        bricolage: ['"Bricolage Grotesque"', 'sans-serif'],
      },
    },
  },
  plugins: [
    plugin(function({ addUtilities }) {
      const rotateValues = [0, 5, 10, 15, 20, 30, 45, 75];
      const rotateXUtilities = {};
      const rotateYUtilities = {};
      const rotateZUtilities = {};

      rotateValues.forEach((value) => {
        const transform = `translate3d(var(--tw-translate-x, 0), var(--tw-translate-y, 0), var(--tw-translate-z, 0)) rotateX(var(--tw-rotate-x, 0)) rotateY(var(--tw-rotate-y, 0)) rotateZ(var(--tw-rotate-z, 0)) skewX(var(--tw-skew-x, 0)) skewY(var(--tw-skew-y, 0)) scaleX(var(--tw-scale-x, 1)) scaleY(var(--tw-scale-y, 1))`;
        rotateXUtilities[`.rotate-x-${value}`] = { '--tw-rotate-x': `${value}deg`, transform };
        rotateYUtilities[`.rotate-y-${value}`] = { '--tw-rotate-y': `${value}deg`, transform };
        rotateZUtilities[`.rotate-z-${value}`] = { '--tw-rotate-z': `${value}deg`, transform };
        if (value !== 0) {
          rotateXUtilities[`.-rotate-x-${value}`] = { '--tw-rotate-x': `-${value}deg`, transform };
          rotateYUtilities[`.-rotate-y-${value}`] = { '--tw-rotate-y': `-${value}deg`, transform };
          rotateZUtilities[`.-rotate-z-${value}`] = { '--tw-rotate-z': `-${value}deg`, transform };
        }
      });

      addUtilities({
        ...rotateXUtilities,
        ...rotateYUtilities,
        ...rotateZUtilities,
        ".perspective-none": { perspective: "none" },
        ".perspective-[1000px]": { perspective: "1000px" },
        ".perspective-[2000px]": { perspective: "2000px" },
        ".transform-style-preserve-3d": { "transform-style": "preserve-3d" },
        ".transform-style-flat": { "transform-style": "flat" },
      });
    })
  ],
}
