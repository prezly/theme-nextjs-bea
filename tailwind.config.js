const defaultTheme = require('tailwindcss/defaultTheme');
const colors = require('tailwindcss/colors');

module.exports = {
    darkMode: 'class',
    content: [
        "./pages/**/*.{js,ts,jsx,tsx}",
        "./modules/**/*.{js,ts,jsx,tsx}",
        "./components/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        colors: {
            transparent: 'transparent',
            current: 'currentColor',
            black: colors.black,
            white: colors.white,
            gray: colors.gray,
            slate: colors.slate,
            rose: colors.rose,
            // emerald: colors.emerald,
            // indigo: colors.indigo,
            // yellow: colors.yellow,
        },
        extend: {
            fontFamily: {
                sans: ['Inter var', ...defaultTheme.fontFamily.sans],
            },
        },
    },
    plugins: [],
}
