module.exports = {
    extends: ['@prezly', '@prezly/eslint-config/react', '@prezly/eslint-config/nextjs'],
    rules: {
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
