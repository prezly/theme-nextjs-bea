/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './app/**/*.{ts,tsx}',
        './components/**/*.{ts,tsx}',
        './modules/**/*.{ts,tsx}',
        './node_modules/@prezly/theme-kit-ui/build/**/*.{js,cjs,mjs}',
    ],
    theme: {
        extend: {},
    },
    plugins: [],
};
