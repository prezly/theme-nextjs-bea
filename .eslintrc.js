module.exports = {
    extends: ['@prezly', '@prezly/eslint-config/react', 'next/core-web-vitals'],
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

        // Ported from `@prezly/eslint-config/next`
        'import/order': [
            'error',
            {
                alphabetize: {
                    order: 'asc',
                    caseInsensitive: true,
                },
                groups: [
                    ['builtin', 'external'],
                    'internal',
                    'parent',
                    'sibling',
                    'index',
                    // This is used for assets and styles, since `import/order` doesn't allow custom group names
                    'unknown',
                ],
                'newlines-between': 'always',
                pathGroups: [
                    {
                        pattern: '*.{svg|png|jpg|jpeg}',
                        patternOptions: { matchBase: true },
                        group: 'unknown',
                        position: 'before',
                    },
                    {
                        pattern: '@/public/images/**',
                        group: 'unknown',
                        position: 'before',
                    },
                    {
                        pattern: '*.scss',
                        patternOptions: { matchBase: true },
                        group: 'unknown',
                        position: 'after',
                    },
                    // For some reason, `*.{scss|css}` makes the config not working as expected
                    {
                        pattern: '*.css',
                        patternOptions: { matchBase: true },
                        group: 'unknown',
                        position: 'after',
                    },
                    {
                        pattern: '@/**',
                        group: 'internal',
                    },
                ],
            },
        ],
    },
    overrides: [
        {
            files: ['pages/**'],
            rules: {
                // Next.js needs default exports for pages and API points
                'import/no-default-export': 'off',
                // Next.js `getServerSideProps` has a quite complex type, so it's safer to define it as a const
                // and have the `GetServerSideProps<P>` type applied to it for better type safety
                'func-style': ['error', 'declaration', { allowArrowFunctions: true }],
            },
        },
    ],
};
