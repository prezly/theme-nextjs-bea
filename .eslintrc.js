module.exports = {
    env: {
        browser: true,
        es2021: true,
        node: true,
    },
    extends: [
        'plugin:react/recommended',
        'plugin:react-hooks/recommended',
        'airbnb-typescript',
        'prettier',
        'next',
        'next/core-web-vitals',
    ],
    parser: '@typescript-eslint/parser',
    parserOptions: {
        ecmaFeatures: {
            jsx: true,
        },
        ecmaVersion: 12,
        sourceType: 'module',
        project: ['./tsconfig.json'],
    },
    plugins: [
        '@typescript-eslint',
        'prettier',
        'react',
        'import',
        'react-hooks',
        'sort-export-all',
        'formatjs',
    ],
    rules: {
        // Prettier handles indent, whitespace and empty lines
        'prettier/prettier': 2,

        // Import rules
        'sort-export-all/sort-export-all': [
            'error',
            'asc',
            {
                caseSensitive: false,
                natural: false,
            },
        ],
        'import/extensions': ['error', 'never', { svg: 'always', json: 'always' }],
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
        'import/prefer-default-export': 'off',
        'import/no-extraneous-dependencies': 'error',
        'sort-imports': [
            'error',
            {
                ignoreCase: true,
                ignoreDeclarationSort: true,
                ignoreMemberSort: false,
                memberSyntaxSortOrder: ['none', 'all', 'multiple', 'single'],
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
        'id-blacklist': [2, 'arr', 'cb', 'e', 'el', 'err', 'idx', 'num', 'str', 'tmp', 'val'],
        'no-return-assign': ['error', 'except-parens'],
        'no-unused-vars': 'off',
        '@typescript-eslint/no-unused-vars': [
            'error',
            { argsIgnorePattern: '^_', ignoreRestSiblings: true },
        ],

        'prefer-destructuring': 'warn',
        'no-nested-ternary': 'warn',

        // React and a11y specific rules
        'react/no-unescaped-entities': 'warn',
        'react/react-in-jsx-scope': 'off',
        'react/prop-types': 'off',
        'react/jsx-filename-extension': ['warn', { extensions: ['.tsx'] }],
        'react/jsx-wrap-multilines': ['error', { arrow: true, return: true, declaration: true }],
        'react-hooks/rules-of-hooks': 'error',
        'react-hooks/exhaustive-deps': 'error',
        // next/links breaks this rule
        'jsx-a11y/anchor-is-valid': 'off',
        'jsx-a11y/alt-text': 'warn',
        'jsx-a11y/click-events-have-key-events': 'warn',
        'jsx-a11y/control-has-associated-label': 'warn',
        'jsx-a11y/label-has-associated-control': [
            'warn',
            {
                assert: 'either',
                controlComponents: ['Field'],
            },
        ],
        'jsx-a11y/iframe-has-title': 'warn',
        'jsx-a11y/no-autofocus': 'warn',
        'jsx-a11y/no-noninteractive-element-interactions': 'warn',
        'jsx-a11y/no-noninteractive-element-to-interactive-role': 'warn',
        'jsx-a11y/no-static-element-interactions': 'warn',
        'jsx-a11y/role-has-required-aria-props': 'warn',

        // Extra rules
        radix: 'off',
        'react/require-default-props': 'off',
        'formatjs/no-emoji': 'error',
    },
};
