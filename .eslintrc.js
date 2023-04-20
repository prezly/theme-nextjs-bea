module.exports = {
    extends: ['@prezly', '@prezly/eslint-config/react', '@prezly/eslint-config/nextjs'],
    rules: {
        // TODO: NextJS Dynamic import doesn't work too well with named exports.
        // Gotta figure out how to make them work together.
        // Some hints here: https://github.com/vercel/next.js/issues/22278#issuecomment-1009865850
        'import/no-default-export': 'off',
        'no-restricted-exports': 'off',

        'jsx-a11y/label-has-associated-control': [
            'warn',
            {
                assert: 'either',
                controlComponents: ['Field'],
            },
        ],

        // Extra rules
        'react/jsx-props-no-spreading': [
            'error',
            {
                exceptions: ['FormattedMessage'],
            },
        ],
    },
};
