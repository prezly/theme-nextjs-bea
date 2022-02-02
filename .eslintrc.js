module.exports = {
    extends: ['@prezly', '@prezly/eslint-config/react', 'next', 'next/core-web-vitals'],
    rules: {
        'import/extensions': ['error', 'never', { svg: 'always', json: 'always', css: 'always' }],
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
                    {
                        pattern: '@/**',
                        group: 'internal',
                    },
                ],
            },
        ],

        // General code-style rules
        '@typescript-eslint/naming-convention': [
            'warn',
            {
                selector: 'default',
                format: ['snake_case', 'strictCamelCase', 'StrictPascalCase', 'UPPER_CASE'], // snake_case enabled for Slate types
                // leadingUnderscore is allowed to allow having unused leading function arguments, e.g.
                // const ownPropSelector = (_state, ownProps) => ownProps.id;
                leadingUnderscore: 'allow',
                trailingUnderscore: 'forbid',
            },
            {
                // This is due to backend sending us snake_case properties
                selector: 'property',
                format: ['snake_case', 'strictCamelCase', 'StrictPascalCase', 'UPPER_CASE'],
                leadingUnderscore: 'forbid',
                trailingUnderscore: 'forbid',
            },
            {
                // This is due to Algolia "_tags", "_highlightResult", "_snippetResult" & "objectID" properties
                // Also for Airtable's "baseId"
                selector: 'property',
                format: ['camelCase'],
                filter: {
                    regex: '^_?(?:tags|highlightResult|snippetResult|objectID|baseID)$',
                    match: true,
                },
                leadingUnderscore: 'allow',
                trailingUnderscore: 'forbid',
            },
            {
                // This is for `dangerouslySetInnerHTML`
                selector: 'property',
                format: ['camelCase'],
                filter: {
                    regex: '^__html$',
                    match: true,
                },
                leadingUnderscore: 'allowDouble',
                trailingUnderscore: 'forbid',
            },
        ],
        // Allow exporting { default }
        'no-restricted-exports': 'warn',

        // next/links breaks this rule
        'jsx-a11y/anchor-is-valid': 'off',
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
