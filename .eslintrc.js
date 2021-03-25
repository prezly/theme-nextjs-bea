module.exports = {
    env: {
        browser: true,
        es2021: true,
        node: true,
    },
    extends: [
        'plugin:react/recommended',
        'airbnb-typescript',
    ],
    parser: '@typescript-eslint/parser',
    parserOptions: {
        ecmaFeatures: {
            jsx: true,
        },
        ecmaVersion: 12,
        sourceType: 'module',
    },
    overrides: [
        {
            files: ['*.ts', '*.tsx'],
            parserOptions: {
                project: ['./tsconfig.json'],
            },
        },
    ],
    plugins: [
        'react',
        '@typescript-eslint',
    ],
    rules: {
        'react/react-in-jsx-scope': 'off',
        'react/prop-types': 'off',
        'react/jsx-filename-extension': ['warn', { extensions: ['.tsx'] }],
        'react/jsx-indent': ['error', 4],
        'import/extensions': ['warn', {
            ts: 'never',
            tsx: 'never',
        }],
        indent: ['error', 4],
        '@typescript-eslint/indent': ['error', 4],
        'jsx-a11y/anchor-is-valid': 'off', // next links break this rule
    },
    settings: {
        'import/resolver': {
            typescript: {}, // this loads <rootdir>/tsconfig.json to eslint
        },
    },
};
