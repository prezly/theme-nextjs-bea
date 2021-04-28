module.exports = {
    env: {
        browser: true,
        es2021: true,
        node: true,
    },
    extends: ['plugin:react/recommended', 'airbnb-typescript'],
    parser: '@typescript-eslint/parser',
    parserOptions: {
        ecmaFeatures: {
            jsx: true,
        },
        ecmaVersion: 12,
        sourceType: 'module',
        project: ['./tsconfig.json'],
    },
    plugins: ['react', '@typescript-eslint'],
    rules: {
        'max-len': ['warn', { code: 120 }],
        'react/react-in-jsx-scope': 'off',
        'react/prop-types': 'off',
        'react/jsx-filename-extension': ['warn', { extensions: ['.tsx'] }],
        'react/jsx-indent': ['error', 4],
        'react/jsx-indent-props': ['error', 4],
        'import/extensions': [
            'warn',
            {
                ts: 'never',
                tsx: 'never',
            },
        ],
        indent: ['error', 4],
        '@typescript-eslint/naming-convention': [
            'warn',
            {
                selector: 'variable',
                format: ['snake_case', 'PascalCase', 'strictCamelCase', 'UPPER_CASE'], // snake_case enabled for Slate types
            },
        ],
        '@typescript-eslint/indent': ['error', 4],
        'jsx-a11y/anchor-is-valid': 'off', // next links break this rule
        radix: 'off',
        'no-return-assign': 'off',
        'import/prefer-default-export': 'off',
    },
};
