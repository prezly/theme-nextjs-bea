/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './app/**/*.{ts,tsx}',
        './components/**/*.{ts,tsx}',
        './modules/**/*.{ts,tsx}',
        './node_modules/@prezly/theme-kit-ui/build/**/*.{js,mjs}',
    ],
    theme: {
        extend: {},
    },
    plugins: [],
};
