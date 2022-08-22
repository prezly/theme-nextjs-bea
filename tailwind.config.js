const defaultTheme = require('tailwindcss/defaultTheme');

/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: 'class',
    content: [
        './pages/**/*.{js,ts,jsx,tsx}',
        './modules/**/*.{js,ts,jsx,tsx}',
        './components/**/*.{js,ts,jsx,tsx}',
    ],
    theme: {
        extend: {
            colors: {
                transparent: 'transparent',
                current: 'currentColor',
                primary: 'var(--prezly-accent-color)',
            },
            fontFamily: {
                sans: ['Satoshi', ...defaultTheme.fontFamily.sans],
            },
            // spacing: {
            //     18: '4.5rem',
            //     112: '28rem',
            //     120: '30rem',
            // },
        },
        boxShadow: {
            'theme-s': '0 1px 2px rgb(17 24 39 / 6%), 0 1px 3px rgb(17 24 39 / 10%)',
            'theme-m': '0 2px 4px rgb(17 24 39 / 6%), 0 4px 6px rgb(17 24 39 / 10%)',
            'theme-l': '0 10px 15px rgb(17 24 39 / 10%), 0 4px 6px rgb(17 24 39 / 5%)',
            'theme-xl': '0 20px 25px rgb(17 24 39 / 8%), 0 10px 10px rgb(17 24 39 / 2%)',
            'theme-xxl': '0 10px 50px rgb(17 24 39 / 10%)',
            'theme-inset': 'inset 0 2px 4px rgb(17 24 39 / 6%)',
        },
    },
    plugins: [require('@tailwindcss/line-clamp'), require('@tailwindcss/typography')],
};
