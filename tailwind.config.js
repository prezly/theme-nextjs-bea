const defaultTheme = require('tailwindcss/defaultTheme');

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
    },
    plugins: [require('@tailwindcss/line-clamp'), require('@tailwindcss/typography')],
};
